// --- VIEW SWITCHING LOGIC ---
function switchView(viewName) {
    // Hide all views
    document.getElementById('view-home').classList.add('hidden-section');
    document.getElementById('view-arena').classList.add('hidden-section');
    document.getElementById('view-leaderboard').classList.add('hidden-section');
    
    // Show selected view
    document.getElementById('view-' + viewName).classList.remove('hidden-section');
    
    // Update Menu Highlight
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('text-red-600'));
    const activeBtn = document.getElementById('btn-' + viewName);
    if(activeBtn) activeBtn.classList.add('text-red-600');

    // Special logic for Arena
    if(viewName === 'arena') {
        startTimer();
        setTimeout(() => {
            const codeInput = document.getElementById('codeInput');
            if(codeInput) codeInput.focus();
        }, 100);
    }
}

// --- MOCK CODE SUBMISSION LOGIC ---
function submitCode() {
    const input = document.getElementById('codeInput').value.toUpperCase().trim();
    const consoleDiv = document.getElementById('consoleOutput');
    
    // UI Feedback
    consoleDiv.innerHTML += `<br>> Analyzing syntax...`;
    consoleDiv.innerHTML += `<br>> Querying ICD-10 Database...`;
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    
    setTimeout(() => {
        // Validation Logic (Simulated)
        if(input.includes("I21")) {
            consoleDiv.innerHTML += `<br>> <span class="text-green-400 font-bold">SUCCESS: Diagnosis Verified.</span>`;
            consoleDiv.innerHTML += `<br>> <span class="text-white">REWARD: +500 XP added.</span>`;
        } else if (input === "") {
            consoleDiv.innerHTML += `<br>> <span class="text-yellow-500">WARNING: No input detected.</span>`;
        } else {
            consoleDiv.innerHTML += `<br>> <span class="text-red-500 font-bold">ERROR: Invalid Code [${input}].</span>`;
            consoleDiv.innerHTML += `<br>> HINT: Check Ischemic Heart Diseases.`;
        }
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }, 1000);
}

// --- TIMER LOGIC ---
let timerInterval;

function startTimer() {
    clearInterval(timerInterval); // Prevent multiple timers
    let time = 300; // 5 minutes
    const timerEl = document.getElementById('timer');
    
    timerInterval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        
        timerEl.innerText = `0${minutes}:${seconds}`;
        time--;

        if (time < 0) {
            clearInterval(timerInterval);
            timerEl.innerText = "FLATLINE";
            timerEl.classList.add('animate-pulse');
        }
    }, 1000);
}