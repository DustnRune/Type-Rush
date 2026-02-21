const WORDS = [
    "algorithm", "array", "binary", "boolean", "byte", "cache", "class", "compiler",
    "data", "debug", "domain", "dynamic", "encode", "entity", "execute", "function",
    "gateway", "hash", "index", "instance", "integer", "interface", "kernel", "logic",
    "loop", "macro", "matrix", "memory", "method", "network", "node", "object",
    "operand", "packet", "parameter", "pattern", "pixel", "pointer", "process",
    "protocol", "query", "queue", "record", "return", "runtime", "script", "search",
    "server", "socket", "source", "stack", "state", "string", "syntax", "system",
    "thread", "token", "variable", "vector", "virtual", "window", "terminal", "console",
    "prompt", "command", "cyber", "neon", "retro", "arcade", "rush", "speed", "type"
];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const hud = document.getElementById('hud');
const gameArea = document.getElementById('game-area');
const typingArea = document.getElementById('typing-area');
const activeInput = document.getElementById('active-input');
const gameOverScreen = document.getElementById('game-over-screen');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

const scoreEl = document.getElementById('score-val');
const comboEl = document.getElementById('combo-val');
const hpEl = document.getElementById('hp-val');

const finalScoreEl = document.getElementById('final-score');
const finalComboEl = document.getElementById('final-combo');
const finalWordsEl = document.getElementById('final-words');
const finalTimeEl = document.getElementById('final-time');

// Game State
let isPlaying = false;
let score = 0;
let combo = 1;
let hp = 3;
let highestCombo = 1;
let wordsTyped = 0;
let startTime = 0;
let lastTime = 0;
let myReq;

let activeWords = []; // Array of objects: { text, typed, element, x, y, speed }
let currentTargetWord = null; // The word currently being typed

// Difficulty State
let timeSinceLastSpawn = 0;
let baseSpawnInterval = 1500; // ms
let currentSpawnInterval = 1500;
let baseFallSpeed = 50; // pixels per second
let currentFallSpeed = 50;
let difficultyMultiplier = 1;

// Dimensions
let gameWidth = gameArea.clientWidth;
let gameHeight = gameArea.clientHeight;

window.addEventListener('resize', () => {
    gameWidth = gameArea.clientWidth;
    gameHeight = gameArea.clientHeight;
});

// Initialization
function resetGame() {
    isPlaying = true;
    score = 0;
    combo = 1;
    hp = 3;
    highestCombo = 1;
    wordsTyped = 0;
    startTime = performance.now();
    lastTime = startTime;

    activeWords.forEach(w => w.element.remove());
    activeWords = [];
    currentTargetWord = null;

    currentSpawnInterval = baseSpawnInterval;
    currentFallSpeed = baseFallSpeed;
    difficultyMultiplier = 1;
    timeSinceLastSpawn = currentSpawnInterval; // Spawn immediately

    updateHUD();
    updateActiveInput();

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    hud.classList.remove('hidden');
    gameArea.classList.remove('hidden');
    typingArea.classList.remove('hidden');

    gameWidth = gameArea.clientWidth;
    gameHeight = gameArea.clientHeight;

    myReq = requestAnimationFrame(gameLoop);
}

function updateHUD() {
    scoreEl.innerText = score;
    comboEl.innerText = `x${combo}`;
    hpEl.innerText = hp;

    // Combo pop effect
    const comboContainer = document.querySelector('.combo-container');
    comboContainer.classList.add('combo-pop');
    setTimeout(() => comboContainer.classList.remove('combo-pop'), 100);
}

function updateActiveInput() {
    if (currentTargetWord) {
        activeInput.innerText = currentTargetWord.typed + "_";
    } else {
        activeInput.innerText = "_";
    }
}

function spawnWord() {
    const text = WORDS[Math.floor(Math.random() * WORDS.length)];
    const element = document.createElement('div');
    element.className = 'falling-word';
    element.innerHTML = text; // initial HTML
    gameArea.appendChild(element);

    // estimate width to keep within bounds
    const estWidth = text.length * 15;
    const maxX = Math.max(0, gameWidth - estWidth - 40);
    const x = Math.random() * maxX + 20;

    // random slight variation in speed
    const speed = currentFallSpeed * (0.8 + Math.random() * 0.4);

    const wordObj = {
        text: text,
        typed: "",
        element: element,
        x: x,
        y: -30, // Start slightly above
        speed: speed
    };

    renderWordString(wordObj);
    element.style.left = `${x}px`;
    element.style.top = `${wordObj.y}px`;

    activeWords.push(wordObj);
}

function renderWordString(wordObj) {
    if (wordObj === currentTargetWord) {
        wordObj.element.classList.add('active');
    } else {
        wordObj.element.classList.remove('active');
    }

    const typedPart = `<span class="typed">${wordObj.typed}</span>`;
    const untypedPart = wordObj.text.substring(wordObj.typed.length);
    wordObj.element.innerHTML = typedPart + untypedPart;
}

function takeDamage() {
    hp--;
    combo = 1;
    updateHUD();

    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'damage-flash';
    document.getElementById('game-container').appendChild(flash);
    setTimeout(() => flash.remove(), 200);

    if (hp <= 0) {
        gameOver();
    }
}

function triggerError() {
    combo = 1;
    updateHUD();
    activeInput.classList.remove('error');
    void activeInput.offsetWidth; // trigger reflow
    activeInput.classList.add('error');
}

function gameOver() {
    isPlaying = false;
    cancelAnimationFrame(myReq);

    const timeSurvived = Math.floor((performance.now() - startTime) / 1000);

    finalScoreEl.innerText = score;
    finalComboEl.innerText = `x${highestCombo}`;
    finalWordsEl.innerText = wordsTyped;
    finalTimeEl.innerText = `${timeSurvived}s`;

    hud.classList.add('hidden');
    gameArea.classList.add('hidden');
    typingArea.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

function gameLoop(timestamp) {
    if (!isPlaying) return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Difficulty scaling
    const timeAlive = (timestamp - startTime) / 1000; // in seconds
    difficultyMultiplier = 1 + (timeAlive / 30); // Increases by 1 every 30 seconds

    currentSpawnInterval = Math.max(400, baseSpawnInterval / difficultyMultiplier);
    currentFallSpeed = baseFallSpeed * difficultyMultiplier;

    // Spawning words
    timeSinceLastSpawn += deltaTime;
    if (timeSinceLastSpawn >= currentSpawnInterval) {
        spawnWord();
        timeSinceLastSpawn = 0;
    }

    // Update words
    for (let i = activeWords.length - 1; i >= 0; i--) {
        let w = activeWords[i];
        w.y += (w.speed * deltaTime) / 1000;
        w.element.style.top = `${w.y}px`;

        // Check if word hit bottom
        // Bottom boundary is roughly gameHeight - typingArea height (80px)
        if (w.y > gameHeight - 100) {
            if (w === currentTargetWord) {
                currentTargetWord = null;
                updateActiveInput();
            }
            w.element.remove();
            activeWords.splice(i, 1);
            takeDamage();
        }
    }

    if (isPlaying) {
        myReq = requestAnimationFrame(gameLoop);
    }
}

// Input Handling
window.addEventListener('keydown', (e) => {
    if (!isPlaying) return;

    // Ignore meta keys
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key.toLowerCase();

    // Only accept single letters
    if (!/^[a-z]$/.test(key)) return;

    if (currentTargetWord) {
        // Continue typing current word
        const nextChar = currentTargetWord.text[currentTargetWord.typed.length];
        if (key === nextChar) {
            currentTargetWord.typed += key;
            renderWordString(currentTargetWord);
            updateActiveInput();

            // Word finished
            if (currentTargetWord.typed === currentTargetWord.text) {
                // Score depends on word length and combo
                const wordScore = currentTargetWord.text.length * 10 * combo;
                score += wordScore;
                wordsTyped++;

                combo++;
                if (combo > highestCombo) highestCombo = combo;

                currentTargetWord.element.classList.add('destroy');
                setTimeout(() => {
                    if (currentTargetWord && currentTargetWord.element) {
                        currentTargetWord.element.remove();
                    }
                }, 300);

                activeWords = activeWords.filter(w => w !== currentTargetWord);
                currentTargetWord = null;

                updateHUD();
                updateActiveInput();
            }
        } else {
            // Typing mistake
            triggerError();
        }
    } else {
        // Find a new word starting with the typed letter
        // Prioritize words closer to the bottom
        let possibleWords = activeWords.filter(w => w.text.startsWith(key) && w.typed === "");

        if (possibleWords.length > 0) {
            possibleWords.sort((a, b) => b.y - a.y);
            currentTargetWord = possibleWords[0];
            currentTargetWord.typed = key;

            // Re-render all words to update active state
            activeWords.forEach(renderWordString);
            updateActiveInput();
        } else {
            // No matching word found
            triggerError();
        }
    }
});

startBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('click', resetGame);
