// ==========================================
// 1. DATA: 10 Medical Cases (12th Grade Level)
// ==========================================
const cases = [
    { 
        id: 1, 
        title: "High Fever", 
        dept: "General", 
        desc: "Patient has 104°F temp, shivering, body ache.", 
        answer: "R50.9", 
        hint: "Search ICD-10 for 'Fever, unspecified'. Code starts with R.", 
        time: 180, 
        solved: false, 
        timeTaken: 0 
    },
    { 
        id: 2, 
        title: "Severe Headache", 
        dept: "Neurology", 
        desc: "Throbbing pain in head, light sensitivity (photophobia).", 
        answer: "R51.9", 
        hint: "Code for 'Headache, unspecified'.", 
        time: 180, 
        solved: false, 
        timeTaken: 0 
    },
    { 
        id: 3, 
        title: "Common Cold", 
        dept: "ENT", 
        desc: "Runny nose, sneezing, sore throat.", 
        answer: "J00", 
        hint: "Acute nasopharyngitis. Starts with J.", 
        time: 180, 
        solved: false, 
        timeTaken: 0 
    },
    { 
        id: 4, 
        title: "Dehydration", 
        dept: "General", 
        desc: "Dry mouth, extreme thirst, dizziness, dark urine.", 
        answer: "E86.0", 
        hint: "Volume depletion. Starts with E.", 
        time: 180, 
        solved: false, 
        timeTaken: 0 
    },
    { 
        id: 5, 
        title: "Bee Sting", 
        dept: "Toxicology", 
        desc: "Swelling from bee sting, no allergy history.", 
        answer: "T63.4", 
        hint: "Toxic effect of venom of arthropod. T63...", 
        time: 180, 
        solved: false, 
        timeTaken: 0 
    },
    { 
        id: 6, 
        title: "Nosebleed", 
        dept: "ENT", 
        desc: "Blood dripping from nostril (Epistaxis).", 
        answer: "R04.0", 
        hint: "Epistaxis. Starts with R.", 
        time: 180, 
        solved: false, 
        timeTaken: 0 
    },
    { 
        id: 7, 
        title: "Sunburn", 
        dept: "Dermatology", 
        desc: "Red, painful skin after beach day. No blisters.", 
        answer: "L55.9", 
        hint: "Sunburn, unspecified. Starts with L.", 
        time: 180, 
        solved: false, 
        timeTaken: 0 
    },
    { 
        id: 8, 
        title: "Acne", 
        dept: "Dermatology", 
        desc: "Pimples (pustules/comedones) on face and back.", 
        answer: "L70.0", 
        hint: "Acne vulgaris. Starts with L.", 
        time: 180, 
        solved: false, 
        timeTaken: 0 
    },
    { 
        id: 9, 
        title: "Cough", 
        dept: "General", 
        desc: "Dry persistent cough. Throat irritation.", 
        answer: "R05", 
        hint: "Cough. Just 3 characters. R0...", 
        time: 180, 
        solved: false, 
        timeTaken: 0 
    },
    { 
        id: 10, 
        title: "Ankle Sprain", 
        dept: "Orthopedics", 
        desc: "Twisted ankle while running. Swelling present.", 
        answer: "S93.4", 
        hint: "Sprain of ankle. Starts with S.", 
        time: 180, 
        solved: false, 
        timeTaken: 0 
    }
];

// ==========================================
// 2. STATE VARIABLES
// ==========================================
let currentCaseIndex = 0;
let timerInterval;

// ==========================================
// 3. NAVIGATION & VIEW SWITCHING
// ==========================================
function switchView(viewName) {
    // Hide all main sections
    const sections = ['view-home', 'view-arena', 'view-results', 'view-leaderboard'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden-section');
    });

    // Show the target section
    const target = document.getElementById('view-' + viewName);
    if(target) target.classList.remove('hidden-section');
    
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if(mobileMenu) mobileMenu.classList.add('hidden');

    // Scroll to top
    window.scrollTo(0,0);

    // Logic based on view
    if(viewName === 'arena') {
        loadCase(currentCaseIndex);
    } else {
        clearInterval(timerInterval); // Pause timer if leaving arena
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// ==========================================
// 4. ARENA LOGIC (THE GAME LOOP)
// ==========================================
function loadCase(index) {
    if(index < 0 || index >= cases.length) return;

    currentCaseIndex = index;
    const data = cases[index];

    // Update UI Elements
    document.getElementById('case-title').innerText = `CASE #${index + 1}: ${data.title.toUpperCase()}`;
    
    const deptEl = document.getElementById('case-dept');
    if(deptEl) deptEl.innerText = data.dept.toUpperCase();
    
    document.getElementById('case-desc').innerText = data.desc;
    document.getElementById('case-hint').innerText = `HINT: ${data.hint}`;
    
    const navCount = document.getElementById('case-nav-count');
    if(navCount) navCount.innerText = `CASE ${index + 1} / 10`;
    
    // Input State Reset
    const input = document.getElementById('codeInput');
    const feedback = document.getElementById('feedback-area');
    const timerDisplay = document.getElementById('timer-display');
    
    input.value = "";
    feedback.innerHTML = ""; // Clear feedback
    
    // Check if already solved
    if(data.solved) {
        input.disabled = true;
        input.value = data.answer;
        input.classList.add('bg-green-50', 'text-green-700');
        feedback.innerHTML = `<span class="text-green-600 font-bold">CASE SOLVED in ${formatTime(180 - data.time)}</span>`;
        
        timerDisplay.innerText = "SOLVED";
        timerDisplay.classList.remove('animate-pulse', 'text-red-600');
        timerDisplay.classList.add('text-green-600', 'border-green-200');
        
        clearInterval(timerInterval);
    } else {
        input.disabled = false;
        input.classList.remove('bg-green-50', 'text-green-700');
        input.focus();
        startCaseTimer(index);
    }
}

function startCaseTimer(index) {
    clearInterval(timerInterval);
    const timerDisplay = document.getElementById('timer-display');
    
    // Reset Timer Styling
    timerDisplay.classList.remove('text-green-600', 'border-green-200');
    timerDisplay.classList.add('text-red-600');

    timerInterval = setInterval(() => {
        if(cases[index].solved) return;

        cases[index].time--;
        const t = cases[index].time;
        
        // Update display
        timerDisplay.innerText = formatTime(t);

        // Warn if low time (optional visual cue)
        if(t <= 30) {
            timerDisplay.classList.add('animate-pulse');
        }

        if(t <= 0) {
            clearInterval(timerInterval);
            timerDisplay.innerText = "TIME UP";
            document.getElementById('codeInput').disabled = true;
            document.getElementById('feedback-area').innerHTML = `<span class="text-red-600 font-bold">TIME EXPIRED</span>`;
        }
    }, 1000);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `0${m}:${s < 10 ? '0' + s : s}`;
}

function nextCase() {
    if(currentCaseIndex < cases.length - 1) {
        loadCase(currentCaseIndex + 1);
    }
}

function prevCase() {
    if(currentCaseIndex > 0) {
        loadCase(currentCaseIndex - 1);
    }
}

function submitDiagnosis() {
    const input = document.getElementById('codeInput');
    const userVal = input.value.toUpperCase().trim();
    const data = cases[currentCaseIndex];
    const feedback = document.getElementById('feedback-area');
    const timerDisplay = document.getElementById('timer-display');

    if(userVal === data.answer) {
        // Correct
        data.solved = true;
        data.timeTaken = 180 - data.time;
        clearInterval(timerInterval);
        
        feedback.innerHTML = `<span class="text-green-600 font-bold">✓ CORRECT DIAGNOSIS</span>`;
        timerDisplay.innerText = "SOLVED";
        timerDisplay.classList.remove('text-red-600');
        timerDisplay.classList.add('text-green-600');
        
        input.classList.add('bg-green-50');
        input.disabled = true;

        checkCompletion();
    } else {
        // Incorrect
        feedback.innerHTML = `<span class="text-red-600 font-bold">⚠ INCORRECT CODE. TRY AGAIN.</span>`;
        // Shake animation effect
        input.classList.add('border-red-500');
        setTimeout(() => input.classList.remove('border-red-500'), 500);
    }
}

// Allow pressing "Enter" to submit
document.getElementById('codeInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        submitDiagnosis();
    }
});

// ==========================================
// 5. RESULTS LOGIC
// ==========================================
function checkCompletion() {
    const allSolved = cases.every(c => c.solved);
    
    if (allSolved) {
        setTimeout(() => {
            if(confirm("All cases solved! View Results?")) {
                finishSession();
            }
        }, 500);
    }
}

function finishSession() {
    clearInterval(timerInterval);
    showResults();
}

function showResults() {
    switchView('results');
    
    let totalScore = 0;
    let totalTime = 0;
    let tableHTML = "";

    cases.forEach(c => {
        const rowClass = c.solved ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
        const statusIcon = c.solved ? "✅" : "❌";
        const timeDisplay = c.solved ? formatTime(c.timeTaken) : "Not Solved";
        
        if(c.solved) totalScore += 100; // Base score
        if(c.solved) totalTime += c.timeTaken;

        tableHTML += `
            <tr class="border-b ${rowClass}">
                <td class="p-3 font-bold text-slate-700">#${c.id}</td>
                <td class="p-3 text-sm">
                    <span class="font-bold">${c.title}</span><br>
                    <span class="text-xs text-slate-500">Code: ${c.answer}</span>
                </td>
                <td class="p-3 text-center text-lg">${statusIcon}</td>
                <td class="p-3 text-right font-mono text-xs font-bold text-slate-600">${timeDisplay}</td>
            </tr>
        `;
    });

    document.getElementById('final-score').innerText = totalScore + " XP";
    document.getElementById('total-time').innerText = formatTime(totalTime);
    document.getElementById('results-body').innerHTML = tableHTML;
}
