const buttons = ['A', 'B', 'X', 'Y'];
let currentButton = '';
let score = 0;
let errors = 0;
const timeLimit = 3000;
let timer, timerInterval;
let lastPressTime = 0;
const debounceTime = 300;
let gameMode = 'easy';
let gameRunning = false;
let currentLang = 'es';

const successSound = new Audio('./audio/success.mp3');
const failSound = new Audio('./audio/fail.mp3');

const translations = {
    es: {
    title: 'Juego Reflejos Xbox',
    easy: 'Modo Fácil',
    hard: 'Modo Difícil',
    menu: 'Menú',
    score: 'Aciertos',
    errors: 'Errores',
    timeLeft: 'Tiempo restante',
    gameOver: '¡Game Over! Puntuación final: '
    },
    en: {
    title: 'Xbox Reflex Game',
    easy: 'Easy Mode',
    hard: 'Hard Mode',
    menu: 'Menu',
    score: 'Hits',
    errors: 'Errors',
    timeLeft: 'Time left',
    gameOver: 'Game Over! Final Score: '
    }
};

function startGame(mode) {
    gameRunning = true;
    gameMode = mode;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('buttonContainer').className = mode;
    score = 0;
    errors = 0;
    updateUI();
    nextRound();
    requestAnimationFrame(checkGamepad);
}

function goToMenu() {
    gameRunning = false;
    clearTimeout(timer);
    clearInterval(timerInterval);
    document.getElementById('game').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
}

function updateUI() {
    document.getElementById('score').textContent = `${translations[currentLang].score}: ${score}`;
    document.getElementById('errors').textContent = `${translations[currentLang].errors}: ${errors}`;
}

function nextRound() {
    if (errors >= 5) {
    endGame();
    return;
    }
    currentButton = buttons[Math.floor(Math.random() * buttons.length)];
    highlightButton(currentButton);
    startTimer();
}

function highlightButton(button) {
    const allButtons = document.querySelectorAll('.button');
    if (gameMode === 'easy') {
    allButtons.forEach(btn => btn.style.opacity = '0.5');
    document.getElementById(button).style.opacity = '1';
    document.getElementById('targetButton').textContent = '';
    } else {
    allButtons.forEach(btn => btn.style.opacity = '0.5');
    document.getElementById('targetButton').textContent = button;
    }
}

function startTimer() {
    clearInterval(timerInterval);
    clearTimeout(timer);
    let remainingTime = timeLimit;
    document.getElementById('timer').textContent = `${translations[currentLang].timeLeft}: ${(remainingTime / 1000).toFixed(2)}s`;

    timerInterval = setInterval(() => {
    remainingTime -= 50;
    document.getElementById('timer').textContent = `${translations[currentLang].timeLeft}: ${(remainingTime / 1000).toFixed(2)}s`;
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
    }
    }, 50);

    timer = setTimeout(() => handleFail(), timeLimit);
}

function handleSuccess() {
    clearTimeout(timer);
    clearInterval(timerInterval);
    successSound.play();
    score++;
    updateUI();
    nextRound();
}

function handleFail() {
    clearTimeout(timer);
    clearInterval(timerInterval);
    failSound.play();
    errors++;
    updateUI();
    nextRound();
}

function endGame() {
    alert(`${translations[currentLang].gameOver} ${score}`);
    goToMenu();
}

function checkGamepad() {
    if (!gameRunning) return;

    const gamepads = navigator.getGamepads();
    
    if (gamepads[0]) {
    const gp = gamepads[0];
    
    // Check if the connected controller is an Xbox controller
    if (gp.id.toLowerCase().includes("xbox")) {
        const buttonMap = { 0: 'A', 1: 'B', 2: 'X', 3: 'Y' };
        const currentTime = Date.now();

        gp.buttons.forEach((button, index) => {
        if (button.pressed && buttonMap[index]) {
            if (currentTime - lastPressTime > debounceTime) {
            lastPressTime = currentTime;
            if (buttonMap[index] === currentButton) {
                handleSuccess();
            } else {
                handleFail();
            }
            }
        }
        });
    } else {
        // If the connected controller isn't an Xbox controller, stop the game and alert the user
        if (gameRunning) {
        alert("Este juego solo acepta controladores Xbox.");
        goToMenu();
        setTimeout(() => {
                location.reload(); // Refresh the page after the alert is dismissed
            }, 500); // Small delay to allow alert to close
        }
    }
    }
    window.requestAnimationFrame(checkGamepad);
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang); // <-- Save to localStorage
    document.getElementById('title').textContent = translations[lang].title;
    document.getElementById('gameTitle').textContent = translations[lang].title;
    document.getElementById('easyBtn').textContent = translations[lang].easy;
    document.getElementById('hardBtn').textContent = translations[lang].hard;
    document.getElementById('menuBtn').textContent = translations[lang].menu;
    updateUI();
    document.getElementById('timer').textContent = `${translations[lang].timeLeft}: 3.00s`;
    document.getElementById('languageSelector').value = lang; // Set the dropdown
}

window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && translations[savedLang]) {
    changeLanguage(savedLang);
    }
});