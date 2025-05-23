const translations = {
    es: {
      title: '🎮PRUEBA TUS REFLEJOS🎮',
      subtitle: 'Selecciona una plataforma',
      xbox: 'XBOX',
      playstation: 'PlayStation',
      keyboard: 'Teclado',
      switch: 'Switch',
      status: 'Estado del controlador:',
      click: 'Haz click para probar la conexión.',
      time: 'Puede tardar un poco, haz click una vez.',
      xboxController: 'Controlador Xbox', // Added here for Xbox controller
      psController: 'Controlador PS',     // Added here for PS controller
      nintendoController: 'Controlador Nintendo', // Added here for Nintendo controller
      keyboardStatus: 'Teclado'  // Added for keyboard status
    },
    en: {
      title: '🎮TEST YOUR REFLEXES🎮',
      subtitle: 'Choose a platform',
      xbox: 'XBOX',
      playstation: 'PlayStation',
      keyboard: 'Keyboard',
      switch: 'Switch',
      status: 'Controller Status:',
      click: 'Click to test connection.',
      time: 'It may take a while, click once.',
      xboxController: 'Xbox controller', // Added here for Xbox controller
      psController: 'PS controller',     // Added here for PS controller
      nintendoController: 'Nintendo Controller', // Added here for Nintendo controller
      keyboardStatus: 'Keyboard'  // Added for keyboard status
    }
  };

  let isKeyboardConnected = false;

  function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.getElementById('title').textContent = translations[lang].title;
    document.getElementById('subtitle').textContent = translations[lang].subtitle;
    document.querySelector('.xbox').textContent = translations[lang].xbox;
    document.querySelector('.play').textContent = translations[lang].playstation;
    document.querySelector('.keyboard').textContent = translations[lang].keyboard;
    document.querySelector('.switch').textContent = translations[lang].switch;
    document.getElementById('languageSelector').value = lang;
    document.getElementById('status').textContent = translations[lang].status;
    document.getElementById('click').textContent = translations[lang].click;
    document.getElementById('time').textContent = translations[lang].time;

    // Update the controller status texts dynamically
    document.getElementById('xboxController').textContent = `${translations[lang].xboxController}: ❌`;
    document.getElementById('psController').textContent = `${translations[lang].psController}: ❌`;
    document.getElementById('nintendoController').textContent = `${translations[lang].nintendoController}: ❌`;
    document.getElementById('keyboardController').textContent = `${translations[lang].keyboardStatus}: ❌`;
  }

  function checkGamepadConnection() {
    const gamepads = navigator.getGamepads();

    // Check Xbox controller (gamepad[0])
    if (gamepads[0] && gamepads[0].connected) {
      document.getElementById('xboxController').textContent = `${translations[document.documentElement.lang].xboxController}: ✔️`;
    } else {
      document.getElementById('xboxController').textContent = `${translations[document.documentElement.lang].xboxController}: ❌`;
    }

    // Check PS controller (gamepad[1])
    if (gamepads[1] && gamepads[1].connected) {
      document.getElementById('psController').textContent = `${translations[document.documentElement.lang].psController}: ✔️`;
    } else {
      document.getElementById('psController').textContent = `${translations[document.documentElement.lang].psController}: ❌`;
    }

    // Check Nintendo controller (Switch) (gamepad[2])
    if (gamepads[2] && gamepads[2].connected) {
      document.getElementById('nintendoController').textContent = `${translations[document.documentElement.lang].nintendoController}: ✔️`;
    } else {
      document.getElementById('nintendoController').textContent = `${translations[document.documentElement.lang].nintendoController}: ❌`;
    }

    // Check Keyboard status by detecting key press
    if (isKeyboardConnected) {
      document.getElementById('keyboardController').textContent = `${translations[document.documentElement.lang].keyboardStatus}: ✔️`;
    } else {
      document.getElementById('keyboardController').textContent = `${translations[document.documentElement.lang].keyboardStatus}: ❌`;
    }
  }

  // Listen for keyboard keydown events to detect if the keyboard is used
  window.addEventListener('keydown', () => {
    if (!isKeyboardConnected) {
      isKeyboardConnected = true;
      checkGamepadConnection(); // Update the keyboard status immediately
    }
  });

  window.addEventListener('load', () => {
    const lang = localStorage.getItem('language') || 'es';
    changeLanguage(lang);

    // Regularly check the connection status of gamepads (every 1000ms / 1 second)
    setInterval(checkGamepadConnection, 1000);
  });