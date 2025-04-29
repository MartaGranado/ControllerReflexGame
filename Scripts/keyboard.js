const buttons = ['A', 'B', 'X', 'Y'];
const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let currentButton = '';
let score = 0;
let errors = 0;
const timeLimit = 3000;
const hardModeTimeLimit = 5000;
let timer, timerInterval;
let currentSequence = '';
let playerInput = '';
let lastPressTime = 0;
const debounceTime = 300;
let gameMode = 'easy';
let gameRunning = false;
let currentLang = 'es';

const successSound = new Audio('./audio/success.mp3');
const failSound = new Audio('./audio/fail.mp3');

const translations = {
    es: {
        title: 'Juego Reflejos Teclado',
        easy: 'Modo Fácil',
        hard: 'Modo Difícil',
        menu: 'Menú',
        score: 'Aciertos',
        errors: 'Errores',
        timeLeft: 'Tiempo restante',
        gameOver: '¡Game Over! Puntuación final: '
    },
    en: {
        title: 'Keyboard Reflex Game',
        easy: 'Easy Mode',
        hard: 'Hard Mode',
        menu: 'Menu',
        score: 'Hits',
        errors: 'Errors',
        timeLeft: 'Time left',
        gameOver: 'Game Over! Final Score: '
    }
};

let gamepadCheckRequest; // Variable to store the request animation frame
let gamepadChecking = false; // Flag to control gamepad check status
let keydownListener; // Store the keydown event listener

// Function to start the gamepad check
function checkGamepad() {
    if (!gameRunning || !gamepadChecking) return;

    const gamepads = navigator.getGamepads();
    let gamepadDetected = false;

    if (gamepads[0]) {
        // Check if any gamepad is detected
        gamepadDetected = true;
    }

    if (gamepadDetected) {
        alert("Este juego solo acepta teclado.");
        goToMenu(); // Stop the game and return to the menu
        setTimeout(() => {
            location.reload(); // Refresh the page after the alert is dismissed
        }, 500); // Small delay to allow alert to close
    } else {
        gamepadCheckRequest = requestAnimationFrame(checkGamepad);
    }
}

// Function to start the game
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

    // Start checking for controllers when the game starts
    gamepadChecking = true;  // Allow the gamepad check to run
    gamepadCheckRequest = requestAnimationFrame(checkGamepad);

    // Register keydown listener only when game is running
    keydownListener = (event) => {
        const keyPressed = event.key.toUpperCase();
        if (gameMode === 'easy') {
            if (keyPressed === currentButton) {
                handleSuccess(); // Correct key pressed
            } else {
                handleFail(); // Incorrect key pressed
            }
        } else if (gameMode === 'hard') {
            const expectedChar = currentSequence[playerInput.length];
            if (keyPressed === expectedChar) {
                playerInput += keyPressed;
                if (playerInput === currentSequence) {
                    handleSuccess();
                }
            } else {
                handleFail(); // Immediately fail on wrong input
            }
        }
    };
    document.addEventListener('keydown', keydownListener);
}

// Function to go to the menu and stop the game
function goToMenu() {
    gameRunning = false;
    clearTimeout(timer);
    clearInterval(timerInterval);
    gamepadChecking = false;  // Stop gamepad checking when returning to the menu
    cancelAnimationFrame(gamepadCheckRequest); // Stop checking for gamepads
    document.removeEventListener('keydown', keydownListener); // Remove the keydown listener
    document.getElementById('game').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
}

// Existing keyboard input check
function checkKeyboardInput() {
    if (!gameRunning) return;

    document.addEventListener('keydown', (event) => {
        const keyPressed = event.key.toUpperCase();

        if (gameMode === 'easy') {
            if (keyPressed === currentButton) {
                handleSuccess(); // Correct key pressed
            } else {
                handleFail(); // Incorrect key pressed
            }
        } else if (gameMode === 'hard') {
            playerInput += keyPressed;

            if (playerInput === currentSequence) {
                handleSuccess();
            } else if (playerInput.length > currentSequence.length) {
                handleFail();
            }
        }
    });
}

// Function to update the UI with score and errors
function updateUI() {
    document.getElementById('score').textContent = `${translations[currentLang].score}: ${score}`;
    document.getElementById('errors').textContent = `${translations[currentLang].errors}: ${errors}`;
}

// Function to generate the random sequence for hard mode
function generateRandomSequence() {
    let sequence = '';
    for (let i = 0; i < 5; i++) {
        sequence += alphanumericChars.charAt(Math.floor(Math.random() * alphanumericChars.length));
    }
    return sequence;
}

// Function to handle when the user succeeds
function handleSuccess() {
    clearTimeout(timer);
    clearInterval(timerInterval);
    successSound.play();
    score++;
    updateUI();
    nextRound();
}

// Function to handle when the user fails
function handleFail() {
    clearTimeout(timer);
    clearInterval(timerInterval);
    failSound.play();
    errors++;
    updateUI();
    nextRound();
}

// Function to start a new round
function nextRound() {
    if (errors >= 5) {
        endGame();
        return;
    }

    if (gameMode === 'easy') {
        currentButton = alphanumericChars.charAt(Math.floor(Math.random() * alphanumericChars.length));
        document.getElementById('targetButton').textContent = currentButton; // Display the character
        startTimer(timeLimit);
    } else {
        currentSequence = generateRandomSequence();
        playerInput = '';
        document.getElementById('targetButton').textContent = currentSequence;
        startTimer(hardModeTimeLimit);
    }
}

// Function to start a timer
function startTimer(limit) {
    clearInterval(timerInterval);
    clearTimeout(timer);
    let remainingTime = limit;
    document.getElementById('timer').textContent = `${translations[currentLang].timeLeft}: ${(remainingTime / 1000).toFixed(2)}s`;

    timerInterval = setInterval(() => {
        remainingTime -= 50;
        document.getElementById('timer').textContent = `${translations[currentLang].timeLeft}: ${(remainingTime / 1000).toFixed(2)}s`;
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            handleFail();
        }
    }, 50);

    timer = setTimeout(() => handleFail(), limit);
}

// Function to end the game
function endGame() {
    alert(`${translations[currentLang].gameOver} ${score}`);
    goToMenu();
}

// Language change function
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.getElementById('title').textContent = translations[lang].title;
    document.getElementById('gameTitle').textContent = translations[lang].title;
    document.getElementById('easyBtn').textContent = translations[lang].easy;
    document.getElementById('hardBtn').textContent = translations[lang].hard;
    document.getElementById('menuBtn').textContent = translations[lang].menu;
    updateUI();
    document.getElementById('timer').textContent = `${translations[lang].timeLeft}: 3.00s`;
    document.getElementById('languageSelector').value = lang;
}

window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && translations[savedLang]) {
        changeLanguage(savedLang);
    }
});