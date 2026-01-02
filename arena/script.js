// --- JNV LEAGUE DATA (Mixed Difficulty) ---
const cases = [
    { 
        id: 1, 
        title: "HEART ATTACK", 
        desc: "Patient shows ST elevation in leads V1-V4. Crushing chest pain radiating to left arm.", 
        hint: "Diagnosis Code starts with 'I'", 
        answer: "I21.9" 
    },
    { 
        id: 2, 
        title: "DENGUE FEVER", 
        desc: "High grade fever, retro-orbital pain, platelet count < 40,000. Vector: Aedes.", 
        hint: "Diagnosis Code starts with 'A'", 
        answer: "A91" 
    },
    { 
        id: 3, 
        title: "CHOLERA", 
        desc: "Severe watery diarrhea ('Rice water stool'). Pathogen: Vibrio cholerae.", 
        hint: "Diagnosis Code starts with 'A0'", 
        answer: "A00" 
    },
    { 
        id: 4, 
        title: "FRACTURE: RADIUS", 
        desc: "Closed fracture of the distal end of radius (Colles' Fracture). Fall on outstretched hand.", 
        hint: "Code starts with 'S52'", 
        answer: "S52.5" 
    },
    { 
        id: 5, 
        title: "APPENDICITIS", 
        desc: "Pain in Right Iliac Fossa. McBurney's point tenderness positive.", 
        hint: "Code starts with 'K35'", 
        answer: "K35.8" 
    },
    { 
        id: 6, 
        title: "RABIES", 
        desc: "History of dog bite. Hydrophobia symptoms present. 100% Fatal if untreated.", 
        hint: "Code starts with 'A82'", 
        answer: "A82.9" 
    }
];

// --- GAME VARIABLES ---
let currentCaseIndex = 0;
let score = 0;
let squadName = "Unknown";
let timeLeft = 30;
let timerInterval;
let caseStartTime;
let stats = { saved: 0, lost: 0, totalTime: 0 };

// --- DOM ELEMENTS ---
const screens = {
    login: document.getElementById('view-login'),
    arena: document.getElementById('view-arena'),
    result: document.getElementById('view-result')
};

const ui = {
    timerText: document.getElementById('timer-text'),
    progressFill: document.getElementById('progress-fill'),
    input: document.getElementById('diagnosisInput'),
    feedback: document.getElementById('feedback-area'),
    caseCard: document.getElementById('main-card')
};

// --- CORE LOGIC ---

function startGame() {
    const inputName = document.getElementById('squadInput').value.trim();
    if(!inputName) {
        alert("SQUAD NAME REQUIRED");
        return;
    }
    squadName = inputName.toUpperCase();
    document.getElementById('hud-squad').innerText = squadName;
    
    switchScreen('arena');
    loadCase(0);
}

function loadCase(index) {
    if(index >= cases.length) {
        endGame();
        return;
    }

    currentCaseIndex = index;
    const data = cases[index];

    // Reset UI
    document.getElementById('case-id').innerText = `CASE 0${index + 1}`;
    document.getElementById('case-title').innerText = data.title;
    document.getElementById('case-desc').innerText = data.desc;
    document.getElementById('case-hint').innerText = `HINT: ${data.hint}`;
    
    ui.input.value = "";
    ui.input.disabled = false;
    ui.input.focus();
    ui.feedback.innerHTML = "";
    ui.caseCard.classList.remove('shake');
    document.body.classList.remove('panic-mode');

    // Reset Timer
    timeLeft = 30; 
    caseStartTime = Date.now();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    updateTimerUI();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();

        if(timeLeft <= 10) {
            document.body.classList.add('panic-mode');
        }

        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            handleResult(false); // Time Up = Failure
        }
    }, 1000);
}

function updateTimerUI() {
    ui.timerText.innerText = `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;
    ui.progressFill.style.width = `${(timeLeft / 30) * 100}%`;
}

function handleResult(success) {
    clearInterval(timerInterval);
    ui.input.disabled = true;

    // Calculate Speed Stats
    const timeTaken = (Date.now() - caseStartTime) / 1000;
    stats.totalTime += timeTaken;

    if(success) {
        stats.saved++;
        // Speed Bonus: 500 Base + 50 points for every second left
        const points = 500 + (timeLeft * 50);
        score += points;
        
        document.getElementById('hud-score').innerText = score;
        ui.feedback.innerHTML = `<span style="color:#10b981">STABILIZED (+${points} XP)</span>`;
        ui.input.style.borderColor = "#10b981";
    } else {
        stats.lost++;
        ui.feedback.innerHTML = `<span style="color:#ef4444">FLATLINE (PATIENT LOST)</span>`;
        ui.input.style.borderColor = "#ef4444";
        ui.caseCard.classList.add('shake');
    }

    // Auto Advance after 1.5s
    setTimeout(() => {
        ui.input.style.borderColor = "#334155"; // Reset border
        loadCase(currentCaseIndex + 1);
    }, 1500);
}

// Check Answer on Enter Key
ui.input.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        const userVal = ui.input.value.trim().toUpperCase();
        const correctVal = cases[currentCaseIndex].answer;
        
        if(userVal === correctVal) {
            handleResult(true);
        } else {
            // Wrong Answer Penalty (Shake)
            ui.caseCard.classList.add('shake');
            setTimeout(() => ui.caseCard.classList.remove('shake'), 400);
            ui.feedback.innerHTML = `<span style="color:#ef4444">INVALID CODE</span>`;
        }
    }
});

function endGame() {
    switchScreen('result');
    document.getElementById('final-xp').innerText = `${score} XP`;
    document.getElementById('final-squad').innerText = squadName;
    
    document.getElementById('stat-saved').innerText = stats.saved;
    document.getElementById('stat-lost').innerText = stats.lost;
    
    const avg = (stats.totalTime / cases.length).toFixed(1);
    document.getElementById('stat-speed').innerText = `${avg}s`;
}

function switchScreen(screenId) {
    Object.values(screens).forEach(el => el.classList.remove('active', 'hidden'));
    Object.values(screens).forEach(el => el.classList.add('hidden'));
    screens[screenId].classList.remove('hidden');
    screens[screenId].classList.add('active');
}