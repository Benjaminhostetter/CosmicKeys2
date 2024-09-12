




const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bulletShotSound = new Audio('missileshot3.wav');
const shipImage = new Image();
shipImage.src = 'assets/PNG/playerShip1_blue.png';
const asteroidImages = [
    new Image(),
    new Image(),
    new Image(),
    new Image()
];

asteroidImages[0].src = 'assets/AsteroidKeys/C/c_big1.png';
asteroidImages[1].src = 'assets/AsteroidKeys/C/c_big2.png';
asteroidImages[2].src = 'assets/AsteroidKeys/C/c_big3.png';
asteroidImages[3].src = 'assets/AsteroidKeys/C/c_big4.png';


const miniAsteroidImages = [
    new Image(),
    new Image(),
    new Image(),
    new Image()
];

// Set the source for each image (replace these paths with your actual mini-asteroid image paths)
miniAsteroidImages[0].src = 'assets/AsteroidKeys/C/c_small1.png';
miniAsteroidImages[1].src = 'assets/AsteroidKeys/C/c_small2.png';
miniAsteroidImages[2].src = 'assets/AsteroidKeys/C/c_small3.png';
miniAsteroidImages[3].src = 'assets/AsteroidKeys/C/c_small4.png';

const missileImage = new Image();
missileImage.src = 'assets/PNG/Lasers/laserBlue02.png'; 

const backgroundImage = new Image();
backgroundImage.src = 'assets/Backgrounds/blue.png';


let baseAsteroidSpeed = 0.8;
let asteroidSpawnRate = 1500; // milliseconds
const initialAsteroidSpawnRate = asteroidSpawnRate;
let asteroidsDestroyed = 0; // Track the number of asteroids destroyed in the current wave
const asteroidSpeedIncrease = 200; // Decrease spawn rate by 200ms every 10 asteroids
let spawnInterval;
const asteroidRadius = 50; 
let score = 0;
let gameOver = false;
let activeNotes = new Set();
let asteroids = [];
let selectedKey = null; // Variable to store the player's selected key
let waveNumber = 1; // Start at wave 1
let displayingWave = false; // State to track if we're currently displaying a wave
let heatSeekingMissiles = []; // Array to store active heat-seeking missiles
let showWaveNumber = false; // Flag to control wave number display
let waveDisplayTimeout; // Timeout reference to clear the wave number display
let asteroidsToDestroy = 5; // Number of asteroids required to progress to the next wave
let shipExplosionCheck = false;
let isRandomKey = false; // Flag to track if "Random" was selected
const asteroidPool = []; // Pool of reusable asteroids
let powerUpStar = null;
let lastStarWave = 0;
let currentScaleIndex = 0; // Track the player's progress in the scale




canvas.width = 800;
canvas.height = 600;

displayStartScreen();
// High Score List
let highScores = [];
loadHighScores();
displayHighScores();


function updateHighScores(name, wave, score, key) {
    // Ensure 'Random' is logged as the key if playing in the Random setting
    const loggedKey = isRandomKey ? 'Random' : key;

    highScores.push({ name: name, wave: wave, score: score, key: loggedKey });
    highScores.sort((a, b) => b.score - a.score); // Sort only by score
    if (highScores.length > 10) {
        highScores.pop();
    }
}

function displayHighScores() {
    const highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = ''; // Clear the current list

    highScores.forEach(entry => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = entry.name;
        row.appendChild(nameCell);
        
        const waveCell = document.createElement('td');
        waveCell.textContent = entry.wave;
        row.appendChild(waveCell);
        
        const scoreCell = document.createElement('td');
        scoreCell.textContent = entry.score;
        row.appendChild(scoreCell);
        
        const keyCell = document.createElement('td');
        keyCell.textContent = entry.key;
        row.appendChild(keyCell);
        
        highScoresList.appendChild(row);
    });
}

function promptForNameAndSaveScore() {
    const nameInputOverlay = document.getElementById('nameInputOverlay');
    const playerNameInput = document.getElementById('playerNameInput');
    const submitNameButton = document.getElementById('submitNameButton');

    // Show the overlay
    nameInputOverlay.style.display = 'flex';

    // Focus on the input field
    playerNameInput.focus();

    // Handle the name submission
    submitNameButton.onclick = () => {
        const playerName = playerNameInput.value.trim();
        
        if (playerName) {
            updateHighScores(playerName, waveNumber, score, selectedKey); // Pass the selectedKey here
            saveHighScores();
    
            // Hide the overlay
            nameInputOverlay.style.display = 'none';
    
            // Display the high scores after saving the new score
            displayHighScores();
    
            // Now show the Game Over screen
            displayGameOver();
        } else {
            alert("Please enter a valid name.");
        }
    };
}

const scales = {
    'C': [0, 2, 4, 5, 7, 9, 11, 12],    // C Major Scale: C, D, E, F, G, A, B, C
    'Db': [1, 3, 5, 6, 8, 10, 0, 1],   // Db Major Scale: Db, Eb, F, Gb, Ab, Bb, C, Db
    'D': [2, 4, 6, 7, 9, 11, 1, 2],    // D Major Scale: D, E, F#, G, A, B, C#, D
    'Eb': [3, 5, 7, 8, 10, 0, 2, 3],   // Eb Major Scale: Eb, F, G, Ab, Bb, C, D, Eb
    'E': [4, 6, 8, 9, 11, 1, 3, 4],    // E Major Scale: E, F#, G#, A, B, C#, D#, E
    'F': [5, 7, 9, 10, 0, 2, 4, 5],    // F Major Scale: F, G, A, Bb, C, D, E, F
    'Gb': [6, 8, 10, 11, 1, 3, 5, 6],  // Gb Major Scale: Gb, Ab, Bb, B, Db, Eb, F, Gb
    'G': [7, 9, 11, 0, 2, 4, 6, 7],    // G Major Scale: G, A, B, C, D, E, F#, G
    'Ab': [8, 10, 0, 1, 3, 5, 7, 8],   // Ab Major Scale: Ab, Bb, C, Db, Eb, F, G, Ab
    'A': [9, 11, 1, 2, 4, 6, 8, 9],    // A Major Scale: A, B, C#, D, E, F#, G#, A
    'Bb': [10, 0, 2, 3, 5, 7, 9, 10],  // Bb Major Scale: Bb, C, D, Eb, F, G, A, Bb
    'B': [11, 1, 3, 4, 6, 8, 10, 11]   // B Major Scale: B, C#, D#, E, F#, G#, A#, B
};

const padSounds = {
    'C': new Audio('pads/C.mp3'),
    'Db': new Audio('pads/C1.mp3'),
    'D': new Audio('pads/D.mp3'),
    'Eb': new Audio('pads/D1.mp3'),
    'E': new Audio('pads/E.mp3'),
    'F': new Audio('pads/F.mp3'),
    'Gb': new Audio('pads/F1.mp3'),
    'G': new Audio('pads/G.mp3'),
    'Ab': new Audio('pads/G1.mp3'),
    'A': new Audio('pads/A.mp3'),
    'Bb': new Audio('pads/A1.mp3'),
    'B': new Audio('pads/B.mp3')
};

let currentPadSound = null; // To store the currently playing pad sound


// Updated list of all major and minor chords
const chords = [
    { name: "A", notes: [9, 13, 16] },    // A Major
    { name: "Am", notes: [9, 12, 16] },   // A Minor
    { name: "A#", notes: [10, 14, 17] },  // A# Major
    { name: "A#m", notes: [10, 13, 17] }, // A# Minor
    { name: "Bb", notes: [10, 14, 17] },  // Bb Major (same as A# Major)
    { name: "Bbm", notes: [10, 13, 17] }, // Bb Minor (same as A# Minor)
    { name: "B", notes: [11, 15, 18] },   // B Major
    { name: "Bm", notes: [11, 14, 18] },  // B Minor
    { name: "C", notes: [0, 4, 7] },      // C Major
    { name: "Cm", notes: [0, 3, 7] },     // C Minor
    { name: "C#", notes: [1, 5, 8] },     // C# Major
    { name: "C#m", notes: [1, 4, 8] },    // C# Minor
    { name: "Db", notes: [1, 5, 8] },     // Db Major (same as C# Major)
    { name: "Dbm", notes: [1, 4, 8] },    // Db Minor (same as C# Minor)
    { name: "D", notes: [2, 6, 9] },      // D Major
    { name: "Dm", notes: [2, 5, 9] },     // D Minor
    { name: "D#", notes: [3, 7, 10] },    // D# Major
    { name: "D#m", notes: [3, 6, 10] },   // D# Minor
    { name: "Eb", notes: [3, 7, 10] },    // Eb Major (same as D# Major)
    { name: "Ebm", notes: [3, 6, 10] },   // Eb Minor (same as D# Minor)
    { name: "E", notes: [4, 8, 11] },     // E Major
    { name: "Em", notes: [4, 7, 11] },    // E Minor
    { name: "F", notes: [5, 9, 12] },     // F Major
    { name: "Fm", notes: [5, 8, 12] },    // F Minor
    { name: "F#", notes: [6, 10, 13] },   // F# Major
    { name: "F#m", notes: [6, 9, 13] },   // F# Minor
    { name: "Gb", notes: [6, 10, 13] },   // Gb Major (same as F# Major)
    { name: "Gbm", notes: [6, 9, 13] },   // Gb Minor (same as F# Minor)
    { name: "G", notes: [7, 11, 14] },    // G Major
    { name: "Gm", notes: [7, 10, 14] },   // G Minor
    { name: "G#", notes: [8, 12, 15] },   // G# Major
    { name: "G#m", notes: [8, 11, 15] },  // G# Minor
    { name: "Ab", notes: [8, 12, 15] },   // Ab Major (same as G# Major)
    { name: "Abm", notes: [8, 11, 15] }   // Ab Minor (same as G# Minor)
];

const nashvilleNumbers = {
    'C': ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    'Db': ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    'D': ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    'Eb': ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    'E': ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    'F': ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    'Gb': ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    'G': ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    'Ab': ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    'A': ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    'Bb': ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
    'B': ['I', 'ii', 'iii', 'IV', 'V', 'vi']
};


// Define the keys and their corresponding chords
const keys = {
    'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am'],
    'Db': ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm'],
    'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm'],
    'Eb': ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm'],
    'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m'],
    'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm'],
    'Gb': ['Gb', 'Abm', 'Bbm', 'B', 'Db', 'Ebm'],
    'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em'],
    'Ab': ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm'],
    'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m'],
    'Bb': ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm'],
    'B': ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m']
};


function displayKeySelection() {
    // Create a background overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 1)'; // Solid black background
    overlay.style.zIndex = '999'; // Ensure it stays behind the menu but on top of the canvas

    // Create the key selection menu
    const menu = document.createElement('div');
    menu.style.position = 'fixed'; // Keep it fixed within the game window
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    menu.style.color = 'white';
    menu.style.font = '20px Custom';
    menu.style.textAlign = 'center';
    menu.style.backgroundColor = 'rgba(0, 0, 0, 1)'; // Solid black background
    menu.style.padding = '20px'; // Add some padding around the content
    menu.style.borderRadius = '10px'; // Optional: add rounded corners
    menu.style.zIndex = '1000'; // Ensure it stays on top of the overlay

    menu.innerHTML = `<p>Select a Key to Practice:</p>`;
    Object.keys(keys).forEach(key => {
        const button = document.createElement('button');
        button.textContent = key;
        button.style.margin = '5px';
        button.style.padding = '10px 20px';
        button.style.font = '16px Custom';
        button.style.backgroundColor = 'transparent'; // Make the button background transparent
        button.style.color = 'white'; // White text color
        button.style.border = '2px solid white'; // White border
        button.style.borderRadius = '5px'; // Optional: Add some border radius for rounded corners
        button.style.cursor = 'pointer'; // Change cursor to pointer on hover
        button.style.width = '120px'; // Set a fixed width for all buttons
        button.style.boxSizing = 'border-box'; // Ensure padding and border are included in the width

        // Add hover effect
        button.onmouseover = () => {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Slight white background on hover
        };
        button.onmouseout = () => {
            button.style.backgroundColor = 'transparent'; // Revert back to transparent
        };

        button.onclick = () => {
            selectedKey = key;
            isRandomKey = false; // Ensure the flag is false when a specific key is selected
            playPadSound(selectedKey); // Play the corresponding pad sound
            overlay.remove(); // Remove the overlay and the menu
            menu.remove();
            startGame();
        };
        menu.appendChild(button);
    });

    // Add a button for Random Key selection
    const randomButton = document.createElement('button');
    randomButton.textContent = 'Random';
    randomButton.style.margin = '5px';
    randomButton.style.padding = '10px 20px';
    randomButton.style.font = '16px Custom';
    randomButton.style.backgroundColor = 'transparent';
    randomButton.style.color = 'white';
    randomButton.style.border = '2px solid white';
    randomButton.style.borderRadius = '5px';
    randomButton.style.cursor = 'pointer';
    randomButton.style.width = '120px';
    randomButton.style.boxSizing = 'border-box';

    randomButton.onmouseover = () => {
        randomButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    };
    randomButton.onmouseout = () => {
        randomButton.style.backgroundColor = 'transparent';
    };

    randomButton.onclick = () => {
        isRandomKey = true; // Set the flag to true when "Random" is selected
        selectedKey = 'Random';
        overlay.remove(); // Remove the overlay and the menu
        menu.remove();
        startGame();
    };

    menu.appendChild(randomButton);

    document.body.appendChild(overlay); // Add the overlay first
    document.body.appendChild(menu); // Then add the menu on top
}

function playPadSound(key) {
    if (currentPadSound) {
        currentPadSound.pause(); // Stop the currently playing pad sound
    }
    currentPadSound = padSounds[key];
    currentPadSound.loop = true; // Loop the pad sound
    currentPadSound.volume = 0.1; // Lower the volume of the pad sound
    currentPadSound.play();
}


function displayStartScreen() {
    const startScreen = document.createElement('div');
    startScreen.id = 'startScreen';
    startScreen.style.position = 'fixed';
    startScreen.style.top = '0';
    startScreen.style.left = '0';
    startScreen.style.width = '100%';
    startScreen.style.height = '100%';
    startScreen.style.backgroundColor = 'rgba(0, 0, 0, 1)'; 
    startScreen.style.display = 'flex';
    startScreen.style.flexDirection = 'column';
    startScreen.style.justifyContent = 'center';
    startScreen.style.alignItems = 'center';
    startScreen.style.zIndex = '1000';

    const title = document.createElement('h1');
    title.textContent = 'Cosmic Keys';
    title.style.color = 'white';
    title.style.fontSize = '70px';
    title.style.fontFamily = 'Custom, sans-serif';
    startScreen.appendChild(title);

    function createButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.margin = '10px';
        button.style.padding = '10px 10px';
        button.style.fontSize = '25px';
        button.style.fontFamily = 'Custom, sans-serif';
        button.style.backgroundColor = 'transparent'; // Transparent background
        button.style.color = 'white'; // White text color
        button.style.border = '2px solid white'; // White border
        button.style.borderRadius = '5px'; // Rounded corners
        button.style.cursor = 'pointer'; // Pointer cursor
        button.style.width = '150px'; // Set a fixed width for all buttons
        button.style.boxSizing = 'border-box'; // Ensure padding and border are included in the width

        // Hover effect
        button.onmouseover = () => {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Slight white background on hover
        };
        button.onmouseout = () => {
            button.style.backgroundColor = 'transparent'; // Revert back to transparent
        };

        return button;
    }

    const playButton = createButton('Play');
    startScreen.appendChild(playButton);

    const settingsButton = createButton('Settings');
    startScreen.appendChild(settingsButton);

    canvas.parentNode.appendChild(startScreen);

    playButton.addEventListener('click', () => {
        startScreen.remove();
        displayKeySelection();
    });

    settingsButton.addEventListener('click', () => {
        alert("Settings feature coming soon!");
    });
}


const ship = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 70,
    width: 50,
    height: 50, // Adjust the height to match your image
    speed: 7,
    dx: 0
};

// Initialize Tone.js with a simple piano sound
const synth = new Tone.Sampler({
    urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3"
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();

// MIDI setup with basic troubleshooting
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
    alert("Web MIDI API is not supported in this browser.");
}



function startGame() {
    waveNumber = 1;
    asteroidSpawnRate = initialAsteroidSpawnRate;
    asteroidsDestroyed = 0;
    asteroidsToDestroy = setAsteroidsToDestroyForWave(waveNumber); // Ensure this is set for Wave 1

    selectRandomKeyIfNeeded(); // Select the initial random key if needed
    displayWaveNumber();
    setTimeout(() => {
        spawnInterval = setInterval(spawnAsteroid, asteroidSpawnRate);
        requestAnimationFrame(update);
    }, 2000);
}

function selectRandomKeyIfNeeded() {
    if (isRandomKey) {
        const availableKeys = Object.keys(keys);
        const randomIndex = Math.floor(Math.random() * availableKeys.length);
        selectedKey = availableKeys[randomIndex];
        playPadSound(selectedKey); // Play the pad sound for the randomly selected key
        console.log("Random key selected: " + selectedKey); // Debugging log
    }
}

function playBulletShotSound() {
    bulletShotSound.currentTime = 0; // Reset the playback to the start
    bulletShotSound.play();
}

const asteroidExplosionSound = new Audio('asteroid-explosion.wav'); // Create it once

function playExplosionSound() {
    asteroidExplosionSound.currentTime = 0; // Reset the sound to the beginning
    asteroidExplosionSound.play();
}

function onMIDISuccess(midiAccess) {
    for (let input of midiAccess.inputs.values()) {
        console.log(`Connected to MIDI device: ${input.name}`);
        input.onmidimessage = getMIDIMessage;
    }
}

function onMIDIFailure() {
    console.error("Failed to access MIDI devices.");
    alert("Failed to access MIDI devices. Please ensure your MIDI controller is connected.");
}

let sustainPedalActive = false; // Track the state of the sustain pedal
let sustainedNotes = new Set(); // Store notes that should be sustained

function getMIDIMessage(message) {
    const [command, note, velocity] = message.data;
    const noteKey = note % 12;  // Normalize the note value for easier comparison

    if (command === 144 && velocity > 0) { // Note on
        activeNotes.add(noteKey);
        playNoteWithSustain(note);
        shootHeatSeekingMissile();
        checkChordMatch();
        checkScaleCompletion(); // Check for scale completion to shoot the star
    } else if (command === 128 || (command === 144 && velocity === 0)) { // Note off
        activeNotes.delete(noteKey);

        // If the pedal is not active and the note is not being held, stop the note
        if (!sustainPedalActive) {
            stopNoteWithSustain(note);
        } else {
            sustainedNotes.add(note); // Add to sustained notes if pedal is active
        }
    } else if (command === 176 && note === 64) { // Control Change (CC) 64 is the sustain pedal
        if (velocity > 0) { // Pedal pressed
            sustainPedalActive = true;
        } else { // Pedal released
            sustainPedalActive = false;
            releaseSustainedNotes(); // Clear all sustained notes except those still being held
        }
    }
}

function clearAllSustainedNotes() {
    sustainedNotes.forEach(note => {
        const noteKey = note % 12;

        // If the note is not currently being held down by the player, stop it
        if (sustainPedalActive === false) {
            stopNoteWithSustain(note);
        }
    });
    
    // Clear the sustained notes set after processing
    sustainedNotes.clear();
}

function playNoteWithSustain(note) {
    const noteName = Tone.Frequency(note, "midi").toNote();
    synth.triggerAttack(noteName);

    // Track the note as sustained only if the pedal is active
    if (sustainPedalActive) {
        sustainedNotes.add(note);
    }
}

function checkScaleCompletion() {
    if (selectedKey && powerUpStar) {
        const scale = scales[selectedKey];
        const activeNotesArray = Array.from(activeNotes);

        console.log("Active notes: ", activeNotesArray);  // Log active notes for debugging
        console.log("Current scale index: ", currentScaleIndex);  // Log current scale index
        console.log("Expected scale note: ", scale[currentScaleIndex]);  // Log expected scale note

        // Check if the next note in the scale is played in any octave
        if (activeNotesArray.length === 1 && activeNotesArray[0] % 12 === scale[currentScaleIndex]) {
            currentScaleIndex++;
            console.log("Correct note played, advancing to index: ", currentScaleIndex);

            if (currentScaleIndex === scale.length) {
                // The player has played the full scale, shoot the star
                console.log("Scale completed! Shooting star.");
                shootStar();
                currentScaleIndex = 0; // Reset the scale index for the next power-up
            }
        } else {
            // If the wrong note is played, reset the scale index
            if (activeNotesArray.length === 1) {
                console.log("Incorrect note played. Resetting scale index.");
            }
            currentScaleIndex = 0;
        }
    }
}

function shootStar() {
    console.log("Launching missile at the power-up star!");

    if (powerUpStar) { // Ensure the star still exists before shooting
        // Create and launch a heat-seeking missile targeting the power-up star
        const missileX = ship.x + ship.width / 2;
        const missileY = ship.y + ship.height / 2;

        const missile = {
            x: missileX,
            y: missileY,
            width: 10, // Adjust the missile size if needed
            height: 20,
            target: powerUpStar, // The target is now the power-up star
            speed: 3 // Missile speed (adjust as needed)
        };
        heatSeekingMissiles.push(missile);

        // Play the missile launch sound
        bulletShotSound.volume = 0.5; // Adjust volume as needed
        playBulletShotSound();

        // Do not set `powerUpStar` to null here. Let the missile handle it on collision.
    }
}


function stopNoteWithSustain(note) {
    const noteName = Tone.Frequency(note, "midi").toNote();
    synth.triggerRelease(noteName);

    // Remove the note from the sustained notes set
    sustainedNotes.delete(note);
}


function releaseSustainedNotes() {
    sustainedNotes.forEach(note => {
        const noteKey = note % 12;

        // Only stop the note if it's not being held down by the player
        if (!activeNotes.has(noteKey)) {
            stopNoteWithSustain(note);
        }
    });
    
    // Clear the sustained notes set
    sustainedNotes.clear();
}


function checkChordMatch() {
    let chordMatched = false;

    asteroids.sort((a, b) => {
        const distA = Math.sqrt((a.x - ship.x) ** 2 + (a.y - ship.y) ** 2);
        const distB = Math.sqrt((b.x - ship.x) ** 2 + (b.y - ship.y) ** 2);
        return distA - distB;
    });

    for (let asteroid of asteroids) {
        // Check if the asteroid has a valid chord object and hasn't been targeted or matched yet
        if (asteroid.chord && asteroid.chord.notes && !asteroid.targeted && !asteroid.matched) {
            const asteroidChord = asteroid.chord.notes.map(note => note % 12);
            const activeNotesArray = Array.from(activeNotes);

            // Check if the active notes exactly match the asteroid chord (all notes and only those notes)
            if (asteroidChord.length === activeNotesArray.length &&
                asteroidChord.every(note => activeNotes.has(note))) {
                asteroid.matched = true; // Mark the asteroid as matched
                chordMatched = true; // Indicate that a match was found

                // Immediately set the ship to target the matched asteroid
                currentTargetAsteroid = asteroid;
                shootHeatSeekingMissile(); // Fire the missile immediately
                break; // Stop after matching and targeting one asteroid
            }
        }
    }

    if (!chordMatched) {
        console.log("No matching chord found or all matching asteroids already targeted.");
    }
}

function getAsteroid() {
    if (asteroidPool.length > 0) {
        return asteroidPool.pop(); // Reuse an existing asteroid
    } else {
        return {}; // Create a new asteroid if none are available
    }
}


function releaseAsteroid(asteroid) {
    asteroidPool.push(asteroid); // Return the asteroid to the pool
}

function removeAsteroid(index) {
    const asteroid = asteroids.splice(index, 1)[0];
    releaseAsteroid(asteroid);
}

function getAsteroidSpeedIncrease(waveNumber) {
    // The initial increase is 200, and it decreases by 10% with each wave
    const initialIncrease = 100;
    const decreaseFactor = 0.5;
    return initialIncrease * Math.pow(decreaseFactor, waveNumber - 1);
}

function drawAsteroids() {
    const maxAsteroidsOnScreen = 10; // Limit the maximum number of asteroids on screen
    const asteroidsToDraw = asteroids.slice(0, maxAsteroidsOnScreen);

    asteroidsToDraw.forEach((asteroid, index) => {
        const dx = ship.x + ship.width / 2 - asteroid.x;
        const dy = ship.y + ship.height / 2 - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Remove asteroid if it moves off-screen
        if (asteroid.y - asteroid.radius > canvas.height) {
            removeAsteroid(index);
            return;
        }
        
        // Normalize and apply speed
        asteroid.x += (dx / distance) * baseAsteroidSpeed;
        asteroid.y += (dy / distance) * baseAsteroidSpeed;

        // Draw the assigned asteroid image
        ctx.drawImage(asteroid.image, asteroid.x - asteroid.radius, asteroid.y - asteroid.radius, asteroid.radius * 2, asteroid.radius * 2);

        // Set the chord text color based on whether it's matched
        ctx.fillStyle = asteroid.matched ? '#FFD700' : 'white'; // Goldish-yellow if matched, white otherwise
        ctx.font = '25px "Custom", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw the chord name
        ctx.fillText(asteroid.chord.name, asteroid.x, asteroid.y - 12); 
        
        // Draw the Nashville number below the chord name
        ctx.fillText(asteroid.nashville, asteroid.x, asteroid.y + 12);

        // Check for collision with the ship (game over condition)
        
        if (distance <= asteroid.radius + ship.width / 2 && shipExplosionCheck === false) {
            shipExplosionCheck = true;

            // Create explosion effect at the ship's position
            createExplosion(ship.x + ship.width / 2, ship.y + ship.height / 2);

            // Play the asteroid explosion sound
            playExplosionSound();

            // Remove the asteroid from the array
            asteroids.splice(index, 1);

            ship.width = 0;
            ship.height = 0;

            // Stop any further updates by returning immediately
            setTimeout(() => {
                gameOver = true;
                gameOverHandler();  // Handle game over after a 2-second delay
            }, 1000);

            return; // Prevent further asteroid checks or updates
        }
    });
}

function spawnAsteroid() {
    if (!displayingWave && selectedKey) {
        if (asteroids.length + asteroidsDestroyed < asteroidsToDestroy) {
            const chordsInKey = keys[selectedKey];
            const availableChords = chordsInKey.filter(chord => !recentlySpawnedChords.includes(chord));

            if (availableChords.length === 0) {
                recentlySpawnedChords = [];
                availableChords.push(...chordsInKey);
            }

            const randomIndex = Math.floor(Math.random() * availableChords.length);
            const randomChord = availableChords[randomIndex];
            const chordData = chords.find(ch => ch.name === randomChord);

            if (chordData) {
                const nashvilleNumber = nashvilleNumbers[selectedKey][chordsInKey.indexOf(randomChord)];
                const asteroid = getAsteroid(); // Get an asteroid from the pool

                // Reset asteroid properties
                asteroid.x = Math.random() * (canvas.width - asteroidRadius * 2) + asteroidRadius;
                asteroid.y = -asteroidRadius;
                asteroid.radius = asteroidRadius;
                asteroid.chord = chordData;
                asteroid.nashville = nashvilleNumber;
                asteroid.matched = false;
                asteroid.targeted = false;

                // Assign a random image to the asteroid
                asteroid.image = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];

                asteroids.push(asteroid);

                // Update recently spawned chords
                recentlySpawnedChords.push(randomChord);
                if (recentlySpawnedChords.length > maxRecentChords) {
                    recentlySpawnedChords.shift();
                }
            } else {
                console.error("Chord data not found for: ", randomChord);
            }
        }
    } else {
        console.error("Selected key is null or wave is displaying");
    }
}

let hasStartedShooting = false; // Flag to track if the ship has started shooting


function drawShip() {
    ctx.save(); // Save the current context

    // Calculate the ship's angle for rotation
    if (hasStartedShooting) {
        ctx.translate(ship.x + ship.width / 2, ship.y + ship.height / 2);
        ctx.rotate(shipAngle + Math.PI / 2); // Rotate the ship 90° to the right when shooting
        ctx.drawImage(shipImage, -ship.width / 2, -ship.height / 2, ship.width, ship.height);
    } else {
        ctx.translate(ship.x + ship.width / 2, ship.y + ship.height / 2);
        ctx.rotate(shipAngle);
        ctx.drawImage(shipImage, -ship.width / 2, -ship.height / 2, ship.width, ship.height);
    }

    ctx.restore(); // Restore the context to its original state
}


function displayWaveNumber() {
    selectRandomKeyIfNeeded(); // Ensure a new random key is selected at the beginning of each wave

    showWaveNumber = true; // Set the flag to true to show the wave number

    // Clear any previous timeout to ensure the display duration is correct
    clearTimeout(waveDisplayTimeout);
    waveDisplayTimeout = setTimeout(() => {
        showWaveNumber = false; // Turn off the flag after 2 seconds
    }, 2000);
}

function drawWaveNumber() {
    if (showWaveNumber) {
        ctx.save(); // Save the current state of the canvas

        // Draw the wave number in the center of the screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '50px Custom';
        ctx.textAlign = 'center';
        ctx.fillText('Wave ' + waveNumber, canvas.width / 2, canvas.height / 2);

        ctx.restore(); // Restore the canvas to the saved state
    }
}


let shipAngle = 0; // Global variable to store the ship's angle
let currentTargetAsteroid = null; // Track the currently targeted asteroid


function shootHeatSeekingMissile() {
    if (currentTargetAsteroid && !currentTargetAsteroid.targeted) {
        const missileX = ship.x + ship.width / 2 + Math.cos(shipAngle) * ship.height / 2;
        const missileY = ship.y + ship.height / 2 + Math.sin(shipAngle) * ship.height / 2;

        const missile = {
            x: missileX,
            y: missileY,
            width: 20,  // Adjust the size according to your missile image
            height: 40, // Adjust the size according to your missile image
            target: currentTargetAsteroid,
            speed: 10 // Adjust speed if needed
        };
        heatSeekingMissiles.push(missile);

        // Mark the asteroid as targeted
        currentTargetAsteroid.targeted = true;

        bulletShotSound.volume = 0.5;
        playBulletShotSound();
    }
}

// Array to store active explosions
let explosions = [];

function createExplosion(x, y) {
    const explosionParticles = [];
    const particleCount = 6;

    for (let i = 0; i < particleCount; i++) {
        const randomMiniAsteroid = miniAsteroidImages[Math.floor(Math.random() * miniAsteroidImages.length)];

        explosionParticles.push({
            x: x,
            y: y,
            speedX: (Math.random() - 0.5) * 4, // Random speed and direction
            speedY: (Math.random() - 0.5) * 4, 
            size: Math.random() * 20 + 10, // Random size for the mini-asteroids
            alpha: 1, // Opacity of the particle
            image: randomMiniAsteroid // Assign a random mini-asteroid image to the particle
        });
    }

    explosions.push({
        particles: explosionParticles,
        duration: 1000, // Duration of the explosion in milliseconds
        startTime: Date.now() // Start time of the explosion
    });
}

function drawExplosions() {
    const currentTime = Date.now();

    // Filter out explosions that have lasted longer than their duration
    explosions = explosions.filter(explosion => {
        const explosionAge = currentTime - explosion.startTime;

        // If the explosion has lasted longer than its duration, remove it
        if (explosionAge >= explosion.duration) {
            return false;
        }

        // Otherwise, keep the explosion
        return true;
    });

    // Iterate over remaining explosions
    explosions.forEach(explosion => {
        explosion.particles.forEach((particle, particleIndex) => {
            // Move the particle according to its speed
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Gradually reduce the alpha value (fade out)
            particle.alpha -= 0.02; // Decrease opacity over time
            particle.alpha = Math.max(0, particle.alpha); // Ensure alpha doesn't go below 0

            // Draw the particle as a mini-asteroid image
            ctx.save();
            ctx.globalAlpha = particle.alpha; // Apply the alpha transparency
            ctx.drawImage(particle.image, particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
            ctx.restore();
        });
    });
}

function drawHeatSeekingMissiles() {
    const missilesToRemove = [];

    heatSeekingMissiles.forEach((missile, index) => {
        const dx = missile.target.x - missile.x;
        const dy = missile.target.y - missile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Remove missile if it moves off-screen or hits the target
        if (missile.x < 0 || missile.x > canvas.width || missile.y < 0 || missile.y > canvas.height) {
            missilesToRemove.push(index);
            return;
        }

        // Update missile position to follow the target
        missile.x += (dx / distance) * missile.speed;
        missile.y += (dy / distance) * missile.speed;

        // Calculate missile angle
        const missileAngle = Math.atan2(dy, dx);

        ctx.save();
        ctx.translate(missile.x, missile.y);
        ctx.rotate(missileAngle + Math.PI / 2); // Add 90 degrees to the angle to correct orientation

        // Draw the missile PNG image
        ctx.drawImage(missileImage, -missile.width / 2, -missile.height / 2, missile.width, missile.height);

        ctx.restore();

        // Check for collision with the target
        if (distance < missile.target.radius) {
            playExplosionSound();
            createExplosion(missile.target.x, missile.target.y);

            // If the target is the power-up star, remove it
            if (missile.target === powerUpStar) {
                powerUpStar = null;
            }

            // Remove the target asteroid or power-up star after the explosion
            const targetIndex = asteroids.indexOf(missile.target);
            if (targetIndex > -1) {
                asteroids.splice(targetIndex, 1);
            }

            missilesToRemove.push(index); // Mark the missile for removal

            score++;
            asteroidsDestroyed++;

            // Check if all asteroids for the current wave have been destroyed
            if (asteroidsDestroyed >= asteroidsToDestroy && asteroids.length === 0) {
                waveNumber++;
                asteroidsDestroyed = 0;
                asteroidsToDestroy = setAsteroidsToDestroyForWave(waveNumber);

                baseAsteroidSpeed += 0.2;

                displayWaveNumber();

                // Check if it's time to spawn the star
                if (waveNumber % 2 === 0 && lastStarWave !== waveNumber) {
                    setTimeout(spawnPowerUpStar, Math.random() * 5000);
                    lastStarWave = waveNumber;
                }

                clearInterval(spawnInterval);
                setTimeout(() => {
                    const speedIncrease = getAsteroidSpeedIncrease(waveNumber);
                    asteroidSpawnRate = asteroidSpawnRate * 0.9;
                    spawnInterval = setInterval(spawnAsteroid, asteroidSpawnRate);
                }, 2000);
            }

            // Stop checking further missiles since the asteroid is destroyed
            return;
        }
    });

    // Remove all missiles that collided with an asteroid or the star
    missilesToRemove.reverse().forEach(index => heatSeekingMissiles.splice(index, 1));
}

function setAsteroidsToDestroyForWave(waveNumber) {
    return 5 + (waveNumber - 1) * 2;
}


let recentlySpawnedChords = []; // Array to track the last two spawned chords
const maxRecentChords = 3; // Limit the recently spawned chords to the last two

function drawScore() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'white';
    ctx.font = '20px Custom';
    ctx.textAlign = 'left'; // Ensure alignment is explicitly set
    ctx.textBaseline = 'top'; // Use 'top' to ensure consistent vertical positioning

    ctx.fillText('Score: ' + score, 10, 15);
    ctx.fillText('Key: ' + selectedKey, 10, 45);

    ctx.restore();
}

function gameOverHandler() {
    if (currentPadSound) {
        currentPadSound.pause();
        currentPadSound.currentTime = 0; // Reset the sound to the start
    }

    const lowestHighScore = highScores.length < 10 ? 0 : highScores[highScores.length - 1].score;

    if (score > lowestHighScore) {
        promptForNameAndSaveScore();
    } else {
        // Display high scores if the player didn't make the top 10
        displayHighScores();
        displayGameOver(); // Display the Game Over screen afterward
    }

    cancelAnimationFrame(update);
}

function spawnPowerUpStar() {
    const randomY = Math.random() * canvas.height * 0.5; // Spawn in the top half of the screen
    powerUpStar = {
        x: -50, // Start off-screen on the left
        y: randomY,
        width: 30,
        height: 30,
        speed: 1.4 // Slower speed for the star
    };
}

function updatePowerUpStar() {
    if (powerUpStar) {
        powerUpStar.x += powerUpStar.speed; // Move the star across the screen

        // If the star goes off the right edge of the screen, remove it
        if (powerUpStar.x > canvas.width + 50) {
            powerUpStar = null;
        }

        // Draw the shiny star with a radial gradient
        ctx.save();
        const gradient = ctx.createRadialGradient(
            powerUpStar.x, powerUpStar.y, 0,
            powerUpStar.x, powerUpStar.y, powerUpStar.width
        );
        gradient.addColorStop(0, 'rgba(255, 255, 0, 1)'); // Bright yellow at the center
        gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.5)'); // Fade to semi-transparent yellow
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Fully transparent at the edges

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(powerUpStar.x, powerUpStar.y, powerUpStar.width, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function displayGameOver() {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '50px Custom';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '30px Custom';
    ctx.fillText('Your Score: ' + score, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Press Spacebar to Restart', canvas.width / 2, canvas.height / 2 + 50);
    ctx.restore();
}

function saveHighScores() {
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function loadHighScores() {
    const savedScores = localStorage.getItem('highScores');
    if (savedScores) {
        highScores = JSON.parse(savedScores);
    }
}



function drawGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '50px Custom';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '30px Custom';
    ctx.fillText('Your Score: ' + score, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Press Spacebar to Restart', canvas.width / 2, canvas.height / 2 + 50);
}


function resetGame() {
    score = 0;
    gameOver = false;
    asteroids = [];
    activeNotes.clear();
    selectedKey = null;

    // Restore the ship's original dimensions
    ship.width = 50;
    ship.height = 50;  // Set this back to the correct height

    // Reset wave-related variables
    asteroidSpawnRate = initialAsteroidSpawnRate;
    asteroidCount = 0;
    waveNumber = 1;
    asteroidsDestroyed = 0;
    displayingWave = false;
    shipExplosionCheck = false; // Reset the explosion check

    clearInterval(spawnInterval);
    spawnInterval = null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Display the Start screen instead of the Key Selection screen
    displayStartScreen();
    displayHighScores();
}

// Call drawExplosions() inside your game loop
function update() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        
        drawShip();
        drawHeatSeekingMissiles();
        drawAsteroids();
        drawExplosions();
        drawScore();
        drawWaveNumber();

        // Only one call to requestAnimationFrame per frame
        requestAnimationFrame(update);
    } else {
        drawGameOver();
    }
}
// Listen for the spacebar to restart the game
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && gameOver) {
        resetGame();
    }
});

// Start the initial game loop (it will now wait until a key is selected)
update();