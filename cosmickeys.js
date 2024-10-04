

const canvas = document.getElementById('gameCanvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');
const bulletShotSound = new Audio('missileshot3.wav');
const shipImage = new Image();
shipImage.src = 'assets/PNG/playerShip1_blue.png';
const missileImage = new Image();
missileImage.src = 'assets/PNG/Lasers/laserBlue02.png'; 
const backgroundImage = new Image();
backgroundImage.src = 'assets/Backgrounds/blue.png';
const asteroidExplosionSound = new Audio('asteroid-explosion.wav');


document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (gameOver) {
            resetGame();
        }
    }
});



const asteroidImages = [
    new Image(),
    new Image(),
    new Image(),
    new Image()
];

const miniAsteroidImages = [
    new Image(),
    new Image(),
    new Image(),
    new Image()
];

const ship = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 70,
    width: 50,
    height: 50,
    speed: 7,
    dx: 0
};

const asteroidImagePaths = {
    'A': [
        'assets/AsteroidKeys/A/A_big1.png',
        'assets/AsteroidKeys/A/A_big2.png',
        'assets/AsteroidKeys/A/A_big3.png',
        'assets/AsteroidKeys/A/A_big4.png',
    ],
    'Ab': [
        'assets/AsteroidKeys/Ab/Ab_big1.png',
        'assets/AsteroidKeys/Ab/Ab_big2.png',
        'assets/AsteroidKeys/Ab/Ab_big3.png',
        'assets/AsteroidKeys/Ab/Ab_big4.png',
    ],
    'B': [
        'assets/AsteroidKeys/B/B_big1.png',
        'assets/AsteroidKeys/B/B_big2.png',
        'assets/AsteroidKeys/B/B_big3.png',
        'assets/AsteroidKeys/B/B_big4.png',
    ],
    'Bb': [
        'assets/AsteroidKeys/Bb/Bb_big1.png',
        'assets/AsteroidKeys/Bb/Bb_big2.png',
        'assets/AsteroidKeys/Bb/Bb_big3.png',
        'assets/AsteroidKeys/Bb/Bb_big4.png',
    ],
    'C': [
        'assets/AsteroidKeys/C/c_big1.png',
        'assets/AsteroidKeys/C/c_big2.png',
        'assets/AsteroidKeys/C/c_big3.png',
        'assets/AsteroidKeys/C/c_big4.png'
    ],
    'D': [
        'assets/AsteroidKeys/D/D_big1.png',
        'assets/AsteroidKeys/D/D_big2.png',
        'assets/AsteroidKeys/D/D_big3.png',
        'assets/AsteroidKeys/D/D_big4.png',
    ],
    'Db': [
        'assets/AsteroidKeys/Db/Db_big1.png',
        'assets/AsteroidKeys/Db/Db_big2.png',
        'assets/AsteroidKeys/Db/Db_big3.png',
        'assets/AsteroidKeys/Db/Db_big4.png',
    ],
    'E': [
        'assets/AsteroidKeys/E/E_big1.png',
        'assets/AsteroidKeys/E/E_big2.png',
        'assets/AsteroidKeys/E/E_big3.png',
        'assets/AsteroidKeys/E/E_big4.png',
    ],
    'Eb': [
        'assets/AsteroidKeys/Eb/Eb_big1.png',
        'assets/AsteroidKeys/Eb/Eb_big2.png',
        'assets/AsteroidKeys/Eb/Eb_big3.png',
        'assets/AsteroidKeys/Eb/Eb_big4.png',
    ],
    'F': [
        'assets/AsteroidKeys/F/F_big1.png',
        'assets/AsteroidKeys/F/F_big2.png',
        'assets/AsteroidKeys/F/F_big3.png',
        'assets/AsteroidKeys/F/F_big4.png',
    ],
    'G': [
        'assets/AsteroidKeys/G/G_big1.png',
        'assets/AsteroidKeys/G/G_big2.png',
        'assets/AsteroidKeys/G/G_big3.png',
        'assets/AsteroidKeys/G/G_big4.png'
    ],
    'Gb': [
        'assets/AsteroidKeys/Gb/Gb_big1.png',
        'assets/AsteroidKeys/Gb/Gb_big2.png',
        'assets/AsteroidKeys/Gb/Gb_big3.png',
        'assets/AsteroidKeys/Gb/Gb_big4.png',
    ]
};


const miniAsteroidImagePaths = {
    'A': [
        'assets/AsteroidKeys/A/A_small1.png',
        'assets/AsteroidKeys/A/A_small2.png',
        'assets/AsteroidKeys/A/A_small3.png',
        'assets/AsteroidKeys/A/A_small4.png',
    ],
    'Ab': [
        'assets/AsteroidKeys/Ab/Ab_small1.png',
        'assets/AsteroidKeys/Ab/Ab_small2.png',
        'assets/AsteroidKeys/Ab/Ab_small3.png',
        'assets/AsteroidKeys/Ab/Ab_small4.png',
    ],
    'B': [
        'assets/AsteroidKeys/B/B_small1.png',
        'assets/AsteroidKeys/B/B_small2.png',
        'assets/AsteroidKeys/B/B_small3.png',
        'assets/AsteroidKeys/B/B_small4.png',
    ],
    'Bb': [
        'assets/AsteroidKeys/Bb/Bb_small1.png',
        'assets/AsteroidKeys/Bb/Bb_small2.png',
        'assets/AsteroidKeys/Bb/Bb_small3.png',
        'assets/AsteroidKeys/Bb/Bb_small4.png',
    ],
    'C': [
        'assets/AsteroidKeys/C/c_small1.png',
        'assets/AsteroidKeys/C/c_small2.png',
        'assets/AsteroidKeys/C/c_small3.png',
        'assets/AsteroidKeys/C/c_small4.png'
    ],
    'D': [
        'assets/AsteroidKeys/D/D_small1.png',
        'assets/AsteroidKeys/D/D_small2.png',
        'assets/AsteroidKeys/D/D_small3.png',
        'assets/AsteroidKeys/D/D_small4.png',
    ],
    'Db': [
        'assets/AsteroidKeys/Db/Db_small1.png',
        'assets/AsteroidKeys/Db/Db_small2.png',
        'assets/AsteroidKeys/Db/Db_small3.png',
        'assets/AsteroidKeys/Db/Db_small4.png',
    ],
    'E': [
        'assets/AsteroidKeys/E/E_small1.png',
        'assets/AsteroidKeys/E/E_small2.png',
        'assets/AsteroidKeys/E/E_small3.png',
        'assets/AsteroidKeys/E/E_small4.png',
    ],
    'Eb': [
        'assets/AsteroidKeys/Eb/Eb_small1.png',
        'assets/AsteroidKeys/Eb/Eb_small2.png',
        'assets/AsteroidKeys/Eb/Eb_small3.png',
        'assets/AsteroidKeys/Eb/Eb_small4.png',
    ],
    'F': [
        'assets/AsteroidKeys/F/F_small1.png',
        'assets/AsteroidKeys/F/F_small2.png',
        'assets/AsteroidKeys/F/F_small3.png',
        'assets/AsteroidKeys/F/F_small4.png',
    ],
    'G': [
        'assets/AsteroidKeys/G/G_small1.png',
        'assets/AsteroidKeys/G/G_small2.png',
        'assets/AsteroidKeys/G/G_small3.png',
        'assets/AsteroidKeys/G/G_small4.png'
    ],
    'Gb': [
        'assets/AsteroidKeys/Gb/Gb_small1.png',
        'assets/AsteroidKeys/Gb/Gb_small2.png',
        'assets/AsteroidKeys/Gb/Gb_small3.png',
        'assets/AsteroidKeys/Gb/Gb_small4.png',
    ]
    // Add paths for other keys...
};

const difficultySettings = {
    'Beginner': {
        asteroidSpeed: 0.5,
        asteroidSpawnRate: 3000,
        asteroidsToDestroy: 2,
        spawnRateDecrease: 0.94,
        toDestroyIncrease: 1,
        asteroidSpeedIncrease: .1,

    },
    'Intermediate': {
        asteroidSpeed: 1,
        asteroidSpawnRate: 2200,
        asteroidsToDestroy: 3,
        spawnRateDecrease: 0.85,
        toDestroyIncrease: 1,
        asteroidSpeedIncrease: .15
    },
    'Advanced': {
        asteroidSpeed: 1.5,
        asteroidSpawnRate: 1500,
        asteroidsToDestroy: 4,
        spawnRateDecrease: 0.8,
        toDestroyIncrease: 1.5,
        asteroidSpeedIncrease: .25
    },
    'Expert': {
        asteroidSpeed: 1.8,
        asteroidSpawnRate: 1250,
        asteroidsToDestroy: 5,
        spawnRateDecrease: 0.75,
        toDestroyIncrease: 2,
        asteroidSpeedIncrease: .4
    },
    'Master': {
        asteroidSpeed: 2.5,
        asteroidSpawnRate: 1100,
        asteroidsToDestroy: 6,
        spawnRateDecrease: 0.7,
        toDestroyIncrease: 2,
        asteroidSpeedIncrease: .5
    }
};

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

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
    alert("Web MIDI API is not supported in this browser.");
}


let currentDifficulty = 'Beginner';
let asteroidSpeed = difficultySettings[currentDifficulty].asteroidSpeed;
let asteroidSpawnRate = difficultySettings[currentDifficulty].asteroidSpawnRate;
let asteroidsToDestroy = difficultySettings[currentDifficulty].asteroidsToDestroy
let asteroidSpeedIncrease = difficultySettings[currentDifficulty].asteroidSpeedIncrease;
let spawnRateDecrease = difficultySettings[currentDifficulty].spawnRateDecrease;
let toDestroyIncrease = difficultySettings[currentDifficulty].toDestroyIncrease;
let recentlySpawnedChords = []; // Array to track the last two spawned chords
const maxRecentChords = 3; // Limit the recently spawned chords to the last two
let settingsButton; // Declare a variable to hold the reference to the settings button

// Array to store active explosions
let explosions = [];

let shipAngle = 0; // Global variable to store the ship's angle
let currentTargetAsteroid = null; // Track the currently targeted asteroid
let asteroidsDestroyed = 0;
let score = 0;
let gameOver = false;
let activeNotes = new Set();
let waveNumber = 1; 
let displayingWave = false; 
let showWaveNumber = false;
let shipExplosionCheck = false;
let isRandomKey = false;
let hasStartedShooting = false;
let asteroidIdCounter = 0; // Counter to assign unique IDs to asteroids

const asteroidsPerChord = 4; // Number of asteroids per chord
const totalChords = 6; // I, ii, iii, IV, V, vi (not using vii°)
const asteroidRadius = 50; // Assuming you have a radius for your asteroids


let waveDisplayTimeout; 
let lastStarWave = 0;
let currentScaleIndex = 0;

let sustainPedalActive = false; 
let sustainedNotes = new Set();

let selectedKey = null;
let currentPadSound = null;
let spawnInterval = null;

let asteroids = [];
let heatSeekingMissiles = []; 
let highScores = [];
const asteroidPool = [];

displayStartScreen();
loadHighScores();
displayHighScores();
initializeAsteroidPool();


function loadAsteroidImages(key) {
    asteroidImages.length = 0; 
    miniAsteroidImages.length = 0;

    // Check if the key exists in asteroidImagePaths
    if (asteroidImagePaths[key]) {
        asteroidImagePaths[key].forEach(path => {
            const img = new Image();
            img.src = path;
            asteroidImages.push(img);
        });
    } else {
        console.error(`Key "${key}" not found in asteroidImagePaths.`);
    }

    // Check if the key exists in miniAsteroidImagePaths
    if (miniAsteroidImagePaths[key]) {
        miniAsteroidImagePaths[key].forEach(path => {
            const img = new Image();
            img.src = path;
            miniAsteroidImages.push(img);
        });
    } else {
        console.error(`Key "${key}" not found in miniAsteroidImagePaths.`);
    }
}

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
            selectKey(key); // Call selectKey instead of setting selectedKey directly
            overlay.remove(); // Remove the overlay and the menu
            menu.remove();
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
        currentPadSound.pause();
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
        button.style.width = '200px'; // Set a fixed width for all buttons
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

    settingsButton = createButton(`${currentDifficulty}`); // Store the button reference
    startScreen.appendChild(settingsButton);

    settingsButton.addEventListener('click', () => {
        displayDifficultySelection(); // Show the difficulty selection
    });

    canvas.parentNode.appendChild(startScreen);

    playButton.addEventListener('click', () => {
        startScreen.remove();
        displayKeySelection();
    });

}

function startGame() {

    asteroidsDestroyed = 0;
    selectRandomKeyIfNeeded();
    loadAsteroidImages(selectedKey); 
    startWave();
    requestAnimationFrame(update);
}

function selectRandomKeyIfNeeded() {
    if (isRandomKey) {
        const availableKeys = Object.keys(keys);
        const randomIndex = Math.floor(Math.random() * availableKeys.length);
        selectedKey = availableKeys[randomIndex];
        playPadSound(selectedKey); // Play the pad sound for the randomly selected key
    }
}

function playBulletShotSound() {
    bulletShotSound.currentTime = 0; // Reset the playback to the start
    bulletShotSound.play();
}

function playExplosionSound() {
    asteroidExplosionSound.currentTime = 0; // Reset the sound to the beginning
    asteroidExplosionSound.play();
}



//PIANO FUNCTIONS

function getMIDIMessage(message) {
    const [command, note, velocity] = message.data;
    const noteKey = note % 12;  // Normalize the note value for easier comparison

    if (command === 144 && velocity > 0) { // Note on
        activeNotes.add(noteKey);
        playNoteWithSustain(note);
        shootHeatSeekingMissile();
        checkChordMatch();
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



// DIFFICULTY FUNCTIONS

function setDifficulty(level, overlay, menu) {
    currentDifficulty = level; // Set the new difficulty level
    const settings = difficultySettings[level];

    if (!settings) {
        console.error(`Difficulty level "${level}" not found.`);
        return; // Exit if the level is not valid
    }


    settingsButton.textContent = `${currentDifficulty}`;

    // Set other game variables related to difficulty
    asteroidSpeed = settings.asteroidSpeed;
    asteroidSpawnRate = settings.asteroidSpawnRate;
    asteroidsToDestroy = settings.asteroidsToDestroy;
    asteroidSpeedIncrease = settings.asteroidSpeedIncrease;

    console.log(`Difficulty set to: ${level}`, settings); // Log settings

    overlay.remove(); // Remove the overlay
    menu.remove(); // Remove the menu
}

function displayDifficultySelection() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '75vw';
    overlay.style.height = '75vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Semi-transparent background
    overlay.style.zIndex = '999';

    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    menu.style.color = 'white';
    menu.style.font = '20px Custom';
    menu.style.textAlign = 'center';
    menu.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    menu.style.padding = '20px';
    menu.style.borderRadius = '10px';
    menu.style.zIndex = '1000';

    menu.innerHTML = `<p>Select Difficulty Level:</p>`;
    const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    difficulties.forEach(level => {
        const button = document.createElement('button');
        button.textContent = level;
        button.style.margin = '5px';
        button.style.padding = '10px 20px';
        button.style.font = '16px Custom';
        button.style.backgroundColor = 'transparent';
        button.style.color = 'white';
        button.style.border = '2px solid white';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.width = '150px';
        button.style.boxSizing = 'border-box';
        button.style.textAlign = 'center'; // Center the text

        button.onmouseover = () => {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        };
        button.onmouseout = () => {
            button.style.backgroundColor = 'transparent';
        };

        button.onclick = () => {
            setDifficulty(level, overlay, menu); // Pass overlay and menu to setDifficulty
        };

        menu.appendChild(button);
    });

    document.body.appendChild(overlay);
    document.body.appendChild(menu);
}


// BULLET FUNCTIONS

function checkChordMatch() {
    let chordMatched = false;

    asteroids.sort((a, b) => {
        const distASquared = (a.x - ship.x) ** 2 + (a.y - ship.y) ** 2;
        const distBSquared = (b.x - ship.x) ** 2 + (b.y - ship.y) ** 2;
        return distASquared - distBSquared;
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
                shootHeatSeekingMissile();
                break; 
            }
        }
    }
}

function getAsteroid() {
    if (asteroidPool.length > 0) {
        return asteroidPool.pop(); // Get an asteroid from the pool
    } else {
        console.error("No asteroids available in the pool.");
        return null; // Return null if the pool is empty
    }
}

function releaseAsteroid(asteroid) {
    // Reset asteroid properties before releasing it
    asteroid.matched = false;
    asteroid.targeted = false;
    asteroid.x = 0;
    asteroid.y = 0;
    asteroid.image = null; // Reset the image if needed
    asteroid.nashville = '';

    asteroidPool.push(asteroid); // Return the asteroid to the pool
}

function removeAsteroid(index) {
    const asteroid = asteroids.splice(index, 1)[0];
    releaseAsteroid(asteroid); // Return it to the pool
}



// ASTEROID FUNCTIONS

function initializeAsteroidPool() {
    asteroidPool.length = 0; // Clear the existing pool

    // Get the chords corresponding to the selected key
    const chordsInKey = keys[selectedKey];

    // Create asteroids for the selected key's chords
    for (let chordName of chordsInKey) {
        const chordData = chords.find(ch => ch.name === chordName);
        if (chordData) {
            for (let i = 0; i < asteroidsPerChord; i++) {
                const asteroid = {
                    chord: chordData,
                    matched: false,
                    targeted: false,
                    x: 0,
                    y: 0,
                    radius: asteroidRadius,
                    image: null, // This will be assigned later
                    nashville: '',
                };
                asteroidPool.push(asteroid); // Add to the pool
            }
        }
    }
}

function createAsteroid() {
    const asteroid = getAsteroid();
    
    if (asteroid) {
        // Set random position for the asteroid
        asteroid.x = Math.random() * (canvas.width - asteroidRadius * 2) + asteroidRadius;
        asteroid.y = -asteroidRadius; // Start above the canvas

        // Assign a random chord and image to the asteroid
        const chordsInKey = keys[selectedKey];
        let randomChord;
        
        // Attempt to select a chord that hasn't been recently used
        do {
            randomChord = chordsInKey[Math.floor(Math.random() * chordsInKey.length)];
        } while (recentlySpawnedChords.includes(randomChord));
        
        // Add the newly selected chord to the recently spawned chords
        recentlySpawnedChords.push(randomChord);
        if (recentlySpawnedChords.length > maxRecentChords) {
            recentlySpawnedChords.shift(); // Remove the oldest chord if we exceed the limit
        }

        const chordData = chords.find(ch => ch.name === randomChord);
        const nashvilleNumber = nashvilleNumbers[selectedKey][chordsInKey.indexOf(randomChord)];

        if (chordData) {
            asteroid.chord = chordData;
            asteroid.nashville = nashvilleNumber;
            asteroid.image = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];
            asteroids.push(asteroid); // Add the asteroid to the active asteroids array
        } else {
            console.error("Chord data not found for: ", randomChord);
        }

        return asteroid;
    }

    return null; // Return null if no asteroid was available in the pool
}





function drawAndLaunchAsteroid(asteroid) {
    // Draw the asteroid image
    ctx.drawImage(asteroid.image, asteroid.x - asteroid.radius, asteroid.y - asteroid.radius, asteroid.radius * 2, asteroid.radius * 2);
    
    // Set fill style based on whether the asteroid is matched
    ctx.fillStyle = asteroid.matched ? '#FFD700' : 'white'; 
    ctx.font = '25px "Custom", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the chord name and Nashville number
    ctx.fillText(asteroid.chord.name, asteroid.x, asteroid.y - 12); 
    ctx.fillText(asteroid.nashville, asteroid.x, asteroid.y + 12);

    // Move the asteroid towards the ship
    const shipCenterX = ship.x + ship.width / 2;
    const shipCenterY = ship.y + ship.height / 2;
    const dx = shipCenterX - asteroid.x;
    const dy = shipCenterY - asteroid.y;
    const distanceSquared = dx * dx + dy * dy;


    const distance = Math.sqrt(distanceSquared);
    if (distance > 0) {
        asteroid.x += (dx / distance) * asteroidSpeed;
        asteroid.y += (dy / distance) * asteroidSpeed;

        // Check for collision
        checkCollisionWithShip(asteroid, distanceSquared);
    }

    // Remove the asteroid if it goes off-screen
    if (asteroid.y - asteroid.radius > canvas.height) {
        removeAsteroid(asteroids.indexOf(asteroid));
    }
}

function checkCollisionWithShip(asteroid, distanceSquared) {
    const collisionDistanceSquared = (asteroid.radius + ship.width / 2) ** 2;
    if (distanceSquared <= collisionDistanceSquared) {
        handleCollision(asteroid);
    }
}



// WAVE FUNCTIONS

function displayWaveNumber() {

    showWaveNumber = true; 

    clearTimeout(waveDisplayTimeout);
    waveDisplayTimeout = setTimeout(() => {
        showWaveNumber = false;
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

function startWave() {
    initializeAsteroidPool();
    displayWaveNumber();
    selectRandomKeyIfNeeded();

    asteroidSpeed += asteroidSpeedIncrease; 
    asteroidSpawnRate *= spawnRateDecrease;
    asteroidsToDestroy += toDestroyIncrease;
    
    console.log(`Wave Number: ${waveNumber}`)
    console.log(`Spawn Rate: ${asteroidSpawnRate}`);
    console.log(`Speed: ${asteroidSpeed}`);
    console.log(`Asteroids to Destroy: ${asteroidsToDestroy}`);

    setTimeout(() =>
    {
        for (let i = 0; i < asteroidsToDestroy; i++) {
            setTimeout(() => {
                createAsteroid();
            }, asteroidSpawnRate * i);
        }
    }, 2000);


}


function waveComplete() {
    if (asteroidsDestroyed >= asteroidsToDestroy && asteroids.length === 0) {
        waveNumber++;
        asteroidsDestroyed = 0; // Reset for the next wave

        clearInterval(spawnInterval); // Stop asteroid spawning during wave transition
        startWave(); // Start the next wave
    }
}


function handleCollision(asteroid) {
    if (!shipExplosionCheck) {
        shipExplosionCheck = true;
        createExplosion(ship.x + ship.width / 2, ship.y + ship.height / 2);
        playExplosionSound();
        removeAsteroid(asteroids.indexOf(asteroid)); // Remove asteroid on collision

        // Reset ship dimensions for game over
        ship.width = 0;
        ship.height = 0;

        // Handle game over
        setTimeout(() => {
            gameOver = true;
            gameOverHandler(); 
        }, 1000);
    }
}

function checkAsteroidsDestroyed() {
    if (asteroidsDestroyed >= asteroidsToDestroy && asteroids.length === 0) {
        // Call the startWave function to prepare for the next wave
        startWave();
    }
}


// SHIP FUNCTIONS

function drawShip() {
    ctx.save(); // Save the current context

    // Calculate the ship's angle for rotation
    ctx.translate(ship.x + ship.width / 2, ship.y + ship.height / 2);
    ctx.rotate(shipAngle); // Keep the rotation based on the current angle
    ctx.drawImage(shipImage, -ship.width / 2, -ship.height / 2, ship.width, ship.height);
    
    ctx.restore(); // Restore the context to its original state

    // Check for collisions with asteroids
    checkCollisionsWithAsteroids();
}

function checkCollisionsWithAsteroids() {
    const shipCenterX = ship.x + ship.width / 2;
    const shipCenterY = ship.y + ship.height / 2;

    // Loop through all asteroids to check for collisions
    for (const asteroid of asteroids) {
        const dx = shipCenterX - asteroid.x;
        const dy = shipCenterY - asteroid.y;
        const distanceSquared = dx * dx + dy * dy;

        // Use squared distance for collision check
        const collisionDistanceSquared = (asteroid.radius + ship.width / 2) ** 2;
        if (distanceSquared <= collisionDistanceSquared) {
            handleCollision(asteroid);
            break; // Exit the loop after handling the collision
        }
    }
}




function shootHeatSeekingMissile() {
    if (currentTargetAsteroid && !currentTargetAsteroid.targeted) {
        // Calculate the angle to the target asteroid
        const dx = currentTargetAsteroid.x - (ship.x + ship.width / 2);
        const dy = currentTargetAsteroid.y - (ship.y + ship.height / 2);
        shipAngle = Math.atan2(dy, dx) + Math.PI / 2; // Rotate 90 degrees to the left

        const missileX = ship.x + ship.width / 2; // Center of the ship
        const missileY = ship.y + ship.height / 2; // Center of the ship

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


function selectKey(key) {
    selectedKey = key; // Set the selected key
    isRandomKey = false; // Ensure the flag is false when a specific key is selected
    playPadSound(selectedKey); // Play the corresponding pad sound
    startGame(); // Start the game
}

function drawHeatSeekingMissiles() {
    for (let i = heatSeekingMissiles.length - 1; i >= 0; i--) { // Loop backwards for safe removal
        const missile = heatSeekingMissiles[i];
        const dx = missile.target.x - missile.x;
        const dy = missile.target.y - missile.y;
        const distanceSquared = dx * dx + dy * dy;

        // Remove missile if it moves off-screen
        if (missile.x < 0 || missile.x > canvas.width || missile.y < 0 || missile.y > canvas.height) {
            heatSeekingMissiles.splice(i, 1); // Remove the missile
            continue; // Skip to the next iteration
        }

        missile.x += (dx / Math.sqrt(distanceSquared)) * missile.speed;
        missile.y += (dy / Math.sqrt(distanceSquared)) * missile.speed;

        // Calculate missile angle
        const missileAngle = Math.atan2(dy, dx);

        ctx.save();
        ctx.translate(missile.x, missile.y);
        ctx.rotate(missileAngle + Math.PI / 2); // Add 90 degrees to the angle to correct orientation

        // Draw the missile PNG image
        ctx.drawImage(missileImage, -missile.width / 2, -missile.height / 2, missile.width, missile.height);
        ctx.restore();

        // Use squared distance for collision check
        const collisionDistanceSquared = missile.target.radius ** 2;
        if (distanceSquared < collisionDistanceSquared) {
            playExplosionSound();
            createExplosion(missile.target.x, missile.target.y);

            // Remove the target asteroid after the explosion
            const targetIndex = asteroids.indexOf(missile.target);
            if (targetIndex > -1) {
                asteroids.splice(targetIndex, 1); // Completely remove the asteroid
            }

            heatSeekingMissiles.splice(i, 1); // Completely remove the missile
            score++;
            asteroidsDestroyed++;
            waveComplete();
        }
    }
}

function setAsteroidsToDestroyForWave(waveNumber) {
    const baseAsteroids = difficultySettings[currentDifficulty].asteroidsToDestroy;
    return baseAsteroids + (waveNumber - 1) * 2; // Adjust the formula as needed
}



function drawScore() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'white';
    ctx.font = '20px Custom';
    ctx.textAlign = 'left'; // Ensure alignment is explicitly set
    ctx.textBaseline = 'top'; // Use 'top' to ensure consistent vertical positioning

    ctx.fillText('Score: ' + score, 10, 15);
    ctx.fillText('Key: ' + selectedKey, 10, 45);
    ctx.fillText('Difficulty: ' + currentDifficulty, 10, 75); // Add this line to display the difficulty

    ctx.restore();
}

function gameOverHandler() {
    if (currentPadSound) {
        currentPadSound.pause();
        currentPadSound.currentTime = 0;
    }

    const lowestHighScore = highScores.length < 10 ? 0 : highScores[highScores.length - 1].score;

    if (score > lowestHighScore) {
        promptForNameAndSaveScore();
    } else {
        displayHighScores();
    }

    cancelAnimationFrame(update);
    clearInterval(spawnInterval); // Stop any asteroid spawning
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
    // Reset game state variables
    score = 0;
    gameOver = false;
    asteroids = [];
    heatSeekingMissiles = []; // Clear heat-seeking missiles
    activeNotes.clear();
    selectedKey = null;
    ship.width = 50; // Reset ship dimensions
    ship.height = 50;

    // Reset difficulty settings based on the current difficulty
    const settings = difficultySettings[currentDifficulty]; // Get current settings
    asteroidSpeed = settings.asteroidSpeed; // Reset to initial asteroid speed
    asteroidSpawnRate = settings.asteroidSpawnRate; // Reset to initial spawn rate
    asteroidsToDestroy = settings.asteroidsToDestroy; // Reset to initial asteroids to destroy

    waveNumber = 1; // Reset wave number
    asteroidsDestroyed = 0; // Reset destroyed asteroids count
    displayingWave = false; // Reset wave display state
    shipExplosionCheck = false; // Reset explosion check
    recentlySpawnedChords = []; // Clear the recently spawned chords

    clearInterval(spawnInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    displayStartScreen(); // Display the start screen
    displayHighScores(); // Ensure high scores are displayed after reset
    update();
}


function update() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        
        drawShip(); // Draw the ship
        drawHeatSeekingMissiles(); // Draw missiles
        drawExplosions(); // Draw explosions
        asteroids.forEach(asteroid => {
            drawAndLaunchAsteroid(asteroid);
        });
        drawScore(); // Draw the score
        drawWaveNumber(); // Draw the wave number

        requestAnimationFrame(update);
    } else {
        drawGameOver();
    }
}







// Start the initial game loop (it will now wait until a key is selected)
update();


