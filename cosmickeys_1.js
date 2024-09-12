

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let baseAsteroidSpeed = 1.0; // Slower initial speed
let asteroidSpawnRate = 3000; // milliseconds
const asteroidRadius = 50; 
let score = 0;
let gameOver = false;
let activeNotes = new Set();
let bullets = [];
let asteroids = [];
const stars = [];
let selectedKey = null; // Variable to store the player's selected key



// Set canvas size to 800x600 pixels
canvas.width = 800;
canvas.height = 600;


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
    'C': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'Db': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'D': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'Eb': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'E': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'F': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'Gb': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'G': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'Ab': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'A': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'Bb': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'B': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
};


// Define the keys and their corresponding chords
const keys = {
    'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'],
    'Db': ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'C°'],
    'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#°'],
    'Eb': ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'D°'],
    'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#°'],
    'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'E°'],
    'Gb': ['Gb', 'Abm', 'Bbm', 'B', 'Db', 'Ebm', 'F°'],
    'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#°'],
    'Ab': ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'G°'],
    'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#°'],
    'Bb': ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'A°'],
    'B': ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#°']
};


function displayKeySelection() {
    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    menu.style.color = 'white';
    menu.style.font = '20px Arial';
    menu.style.textAlign = 'center';

    menu.innerHTML = `<p>Select a Key to Practice:</p>`;
    Object.keys(keys).forEach(key => {
        const button = document.createElement('button');
        button.textContent = key;
        button.style.margin = '5px';
        button.style.padding = '10px 20px';
        button.style.font = '16px Arial';
        button.onclick = () => {
            selectedKey = key;
            menu.remove();
            startGame();
        };
        menu.appendChild(button);
    });

    document.body.appendChild(menu);
}

// Call this function when the page loads to display the key selection menu
displayKeySelection();

const ship = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 20,
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

function createStars(count) {
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.5 + 0.5,
            twinkle: Math.random() * 0.05 + 0.01
        });
    }
}

createStars(100); // Create 100 stars for the background

function drawStars() {
    ctx.save();
    ctx.fillStyle = 'white';
    
    stars.forEach(star => {
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Adjust alpha for a twinkling effect
        star.alpha += star.twinkle;
        if (star.alpha >= 1 || star.alpha <= 0.5) {
            star.twinkle = -star.twinkle;
        }
    });

    ctx.restore();
}

function startGame() {
    requestAnimationFrame(update); // Start the game loop
    setInterval(spawnAsteroid, asteroidSpawnRate); // Start spawning asteroids
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

function getMIDIMessage(message) {
    const [command, note, velocity] = message.data;
    
    const normalizedNote = note % 12;
    const octave = Math.floor(note / 12) - 1; // MIDI note number to octave
    const noteName = Tone.Frequency(note, "midi").toNote(); // Get the note name with octave

    if (command === 144 && velocity > 0) { // Note on
        activeNotes.add(normalizedNote);
        playNote(noteName);
        shootBullet(); // Shoot a bullet when a key is pressed
        checkChordMatch();
    } else if (command === 128 || (command === 144 && velocity === 0)) { // Note off
        activeNotes.delete(normalizedNote);
        stopNote(noteName);
    }
}

function playNote(noteName) {
    synth.triggerAttack(noteName);
}

function stopNote(noteName) {
    synth.triggerRelease(noteName);
}

function checkChordMatch() {
    asteroids.forEach(asteroid => {
        // Check if the asteroid has a valid chord object
        if (asteroid.chord && asteroid.chord.notes) {
            const asteroidChord = asteroid.chord.notes.map(note => note % 12);

            // Check if the active notes include the correct chord notes in any octave
            if (asteroidChord.every(note => activeNotes.has(note))) {
                asteroid.matched = true; // Mark the asteroid as matched

                // Immediately set the ship to target the matched asteroid
                currentTargetAsteroid = asteroid;
            }
        } else {
            console.error("Asteroid chord is undefined or does not have notes", asteroid.chord);
        }
    });
}

function drawAsteroids() {
    asteroids.forEach((asteroid, index) => {
        // Calculate direction towards the ship
        const dx = ship.x + ship.width / 2 - asteroid.x;
        const dy = ship.y + ship.height / 2 - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize and apply speed
        asteroid.x += (dx / distance) * baseAsteroidSpeed;
        asteroid.y += (dy / distance) * baseAsteroidSpeed;

        // Create a radial gradient for the flaming effect
        const gradient = ctx.createRadialGradient(
            asteroid.x, asteroid.y, asteroid.radius * 0.3, // Inner circle
            asteroid.x, asteroid.y, asteroid.radius         // Outer circle
        );
        gradient.addColorStop(0, 'orange');
        gradient.addColorStop(0.5, 'red');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)'); // Transparent at the edges

        // Draw the flaming effect
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw the core of the asteroid
        ctx.fillStyle = '#8B4513'; // Brownish color for the asteroid's core
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Set the chord text color based on whether it's matched
        ctx.fillStyle = asteroid.matched ? '#FFD700' : 'white'; // Goldish-yellow if matched, white otherwise
        ctx.font = '20px "Orbitron", sans-serif'; // Futuristic font
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; // Vertically center the text

        // Draw the chord name
        ctx.fillText(asteroid.chord.name, asteroid.x, asteroid.y - 10); // Chord name slightly above center
        
        // Draw the Nashville number directly below the chord name
        ctx.fillText(asteroid.nashville, asteroid.x, asteroid.y + 10);

        // Reset shadow settings for other drawings
        ctx.shadowColor = 'transparent';

        // Check for collision with the ship (game over condition)
        if (distance < asteroid.radius + ship.width / 2) {
            gameOver = true;
        }
    });
}

let hasStartedShooting = false; // Flag to track if the ship has started shooting


function drawShip() {
    ctx.save(); // Save the current context

    // Move the origin to the ship's position and conditionally rotate
    ctx.translate(ship.x + ship.width / 2, ship.y + ship.height / 2);
    if (hasStartedShooting) {
        ctx.rotate(shipAngle + Math.PI / 2); // Rotate the ship 90° to the right when shooting
    } else {
        ctx.rotate(shipAngle); // No additional rotation before shooting
    }

    // Draw the ship's body (a 3D-like fuselage)
    ctx.fillStyle = 'silver';
    ctx.beginPath();
    ctx.moveTo(0, -ship.height / 2); // Nose of the spaceship (top of the triangle)
    ctx.lineTo(-ship.width / 2, ship.height / 2); // Left corner
    ctx.lineTo(ship.width / 2, ship.height / 2); // Right corner
    ctx.closePath();
    ctx.fill();

    // Add shading to the body for a 3D effect
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(0, -ship.height / 2);
    ctx.lineTo(-ship.width / 4, ship.height / 4);
    ctx.lineTo(ship.width / 4, ship.height / 4);
    ctx.closePath();
    ctx.fill();

    // Draw the ship's cockpit (a 3D-like glass)
    ctx.fillStyle = 'lightblue';
    ctx.beginPath();
    ctx.moveTo(-ship.width / 8, -ship.height / 2 + 5);
    ctx.lineTo(ship.width / 8, -ship.height / 2 + 5);
    ctx.lineTo(0, -ship.height / 4);
    ctx.closePath();
    ctx.fill();

    // Add a highlight to the cockpit for a glass effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(-ship.width / 16, -ship.height / 2 + 7);
    ctx.lineTo(ship.width / 16, -ship.height / 2 + 7);
    ctx.lineTo(0, -ship.height / 4 + 3);
    ctx.closePath();
    ctx.fill();

    // Draw the wings with a 3D effect
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(-ship.width / 2, ship.height / 2); // Left side wing
    ctx.lineTo(-ship.width / 1.5, ship.height * 0.75);
    ctx.lineTo(-ship.width / 3, ship.height / 2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(ship.width / 2, ship.height / 2); // Right side wing
    ctx.lineTo(ship.width / 1.5, ship.height * 0.75);
    ctx.lineTo(ship.width / 3, ship.height / 2);
    ctx.closePath();
    ctx.fill();

    // Add shading to the wings for a 3D effect
    ctx.fillStyle = 'darkgray';
    ctx.beginPath();
    ctx.moveTo(-ship.width / 2, ship.height / 2); // Left side wing shadow
    ctx.lineTo(-ship.width / 1.7, ship.height * 0.65);
    ctx.lineTo(-ship.width / 3, ship.height / 2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(ship.width / 2, ship.height / 2); // Right side wing shadow
    ctx.lineTo(ship.width / 1.7, ship.height * 0.65);
    ctx.lineTo(ship.width / 3, ship.height / 2);
    ctx.closePath();
    ctx.fill();

    // Draw the thruster with a 3D effect
    ctx.fillStyle = 'darkred';
    ctx.fillRect(-ship.width / 6, ship.height / 2, ship.width / 3, ship.height / 4);

    // Add a glowing effect to the thruster
    ctx.shadowColor = 'orange';
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'red';
    ctx.fillRect(-ship.width / 8, ship.height / 2, ship.width / 4, ship.height / 6);

    ctx.restore(); // Restore the context to its original state
}


function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.speedX;
        bullet.y += bullet.speedY;

        // Draw the bullet
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullet if it goes off the screen
        if (bullet.y < 0 || bullet.y > canvas.height || bullet.x < 0 || bullet.x > canvas.width) {
            bullets.splice(index, 1);
        }
    });
}

let shipAngle = 0; // Global variable to store the ship's angle
let currentTargetAsteroid = null; // Track the currently targeted asteroid


function shootBullet() {
    if (currentTargetAsteroid === null || !asteroids.includes(currentTargetAsteroid)) {
        // If no asteroid is currently targeted or the targeted asteroid is destroyed, target a new one
        if (asteroids.length > 0) {
            currentTargetAsteroid = asteroids[Math.floor(Math.random() * asteroids.length)];
        }
    }

    if (currentTargetAsteroid) {
        // Set the flag to true when the ship starts shooting
        hasStartedShooting = true;

        // Calculate direction towards the current target asteroid
        const dx = currentTargetAsteroid.x - ship.x;
        const dy = currentTargetAsteroid.y - ship.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate the angle in radians
        shipAngle = Math.atan2(dy, dx);

        // Calculate the bullet's starting position (nose of the ship)
        const bulletX = ship.x + ship.width / 2 + Math.cos(shipAngle) * ship.height / 2;
        const bulletY = ship.y + ship.height / 2 + Math.sin(shipAngle) * ship.height / 2;

        const bullet = {
            x: bulletX,
            y: bulletY,
            width: 5,
            height: 10,
            speedX: (dx / distance) * 5, // Speed along x-axis
            speedY: (dy / distance) * 5  // Speed along y-axis
        };
        bullets.push(bullet);
    }
}

function checkBulletCollision() {
    bullets.forEach((bullet, bIndex) => {
        asteroids.forEach((asteroid, aIndex) => {
            const distX = Math.abs(bullet.x - asteroid.x);
            const distY = Math.abs(bullet.y - asteroid.y);

            // Check for collision with the asteroid
            if (distX < asteroid.radius && distY < asteroid.radius) {
                if (asteroid.matched) {
                    // Only destroy the asteroid if it has been matched
                    bullets.splice(bIndex, 1);
                    asteroids.splice(aIndex, 1);

                    // Clear the current target if it was the one destroyed
                    if (asteroid === currentTargetAsteroid) {
                        currentTargetAsteroid = null;
                    }
                    
                    score++;
                } else {
                    // Remove the bullet even if the asteroid isn't matched
                    bullets.splice(bIndex, 1);
                }
            }
        });
    });
}

function spawnAsteroid() {
    if (selectedKey) {
        const chordsInKey = keys[selectedKey]; // Get chords for the selected key
        const randomIndex = Math.floor(Math.random() * chordsInKey.length);
        const randomChord = chordsInKey[randomIndex];
        const chordData = chords.find(ch => ch.name === randomChord); // Find chord data

        if (chordData) { // Ensure chordData exists
            const nashvilleNumber = nashvilleNumbers[selectedKey][randomIndex]; // Get the Nashville Number
            const x = Math.random() * (canvas.width - asteroidRadius * 2) + asteroidRadius;
            asteroids.push({
                x: x,
                y: -asteroidRadius,
                radius: asteroidRadius,
                chord: chordData, // Assign the filtered chord to the asteroid
                nashville: nashvilleNumber // Add the Nashville Number
            });
            console.log("Asteroid spawned with chord: ", chordData.name, " and Nashville Number: ", nashvilleNumber); // Log successful asteroid spawn
        } else {
            console.error("Chord data not found for: ", randomChord); // Log specific chord lookup failure
        }
    } else {
        console.error("Selected key is null");
    }
}


function drawScore() {
    ctx.save(); // Save the current state of the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any transformations applied to the canvas
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left'; // Align text to the left
    ctx.fillText('Score: ' + score, 10, 30); // Fixed position
    ctx.restore(); // Restore the canvas to the saved state
}

function drawGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '30px Arial';
    ctx.fillText('Your Score: ' + score, canvas.width / 2, canvas.height / 2);
    ctx.fillText('Press Spacebar to Restart', canvas.width / 2, canvas.height / 2 + 50);
}

function resetGame() {
    // Reset score and game state variables
    score = 0;
    gameOver = false;
    asteroids = [];
    bullets = [];
    activeNotes.clear();
    selectedKey = null;

    // Clear the canvas to remove the 'Game Over' screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Display the key selection menu again
    displayKeySelection();
}

function update() {
    console.log("Update loop running"); // Debugging log

    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black'; // Set the background to black
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawStars(); // Draw stars in the background
        drawShip();
        drawBullets();
        drawAsteroids();
        drawScore();
        checkBulletCollision();

        requestAnimationFrame(update); // Continue the game loop
    } else {
        console.log("Game Over triggered"); // Debugging log
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