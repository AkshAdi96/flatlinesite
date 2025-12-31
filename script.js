// --- DATA: 10 Medical Cases (12th Grade Level) ---
const cases = [
    { id: 1, title: "High Fever", dept: "General", desc: "Patient has 104°F temp, shivering.", answer: "R50.9", hint: "Search ICD-10 for 'Fever, unspecified'. Code starts with R.", time: 180, solved: false, timeTaken: 0 },
    { id: 2, title: "Severe Headache", dept: "Neurology", desc: "Throbbing pain in head, light sensitivity.", answer: "R51.9", hint: "Code for 'Headache, unspecified'.", time: 180, solved: false, timeTaken: 0 },
    { id: 3, title: "Common Cold", dept: "ENT", desc: "Runny nose, sneezing, sore throat.", answer: "J00", hint: "Acute nasopharyngitis. Starts with J.", time: 180, solved: false, timeTaken: 0 },
    { id: 4, title: "Dehydration", dept: "General", desc: "Dry mouth, extreme thirst, dizziness.", answer: "E86.0", hint: "Volume depletion. Starts with E.", time: 180, solved: false, timeTaken: 0 },
    { id: 5, title: "Bee Sting", dept: "Toxicology", desc: "Swelling from bee sting, no allergy.", answer: "T63.4", hint: "Toxic effect of venom of arthropod. T63...", time: 180, solved: false, timeTaken: 0 },
    { id: 6, title: "Nosebleed", dept: "ENT", desc: "Blood dripping from nostril.", answer: "R04.0", hint: "Epistaxis. Starts with R.", time: 180, solved: false, timeTaken: 0 },
    { id: 7, title: "Sunburn", dept: "Dermatology", desc: "Red, painful skin after beach day.", answer: "L55.9", hint: "Sunburn, unspecified. Starts with L.", time: 180, solved: false, timeTaken: 0 },
    { id: 8, title: "Acne", dept: "Dermatology", desc: "Pimples on face and back.", answer: "L70.0", hint: "Acne vulgaris. Starts with L.", time: 180, solved: false, timeTaken: 0 },
    { id: 9, title: "Cough", dept: "General", desc: "Dry persistent cough.", answer: "R05", hint: "Cough. Just 3 characters. R0...", time: 180, solved: false, timeTaken: 0 },
    { id: 10, title: "Ankle Sprain", dept: "Orthopedics", desc: "Twisted ankle while running.", answer: "S93.4", hint: "Sprain of ankle. Starts with S.", time: 180, solved: false, timeTaken: 0 },
];

let currentCaseIndex = 0;
let timerInterval;

// --- VIEW SWITCHING ---
function switchView(viewName) {
    document.querySelectorAll('section').forEach(el => el.classList.add('hidden-section'));
    document.getElementById('view-' + viewName).classList.remove('hidden-section');
    
    // Close mobile menu if open
    document.getElementById('mobile-menu').classList.remove('open');

    if(viewName === 'arena') {
        loadCase(currentCaseIndex);
    } else {
        clearInterval(timerInterval); // Pause timer if leaving arena
    }
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('open');
}

// --- ARENA LOGIC ---
function loadCase(index) {
    currentCaseIndex = index;
    const data = cases[index];

    // Update UI
    document.getElementById('case-title').innerText = `CASE #${index + 1}: ${data.title.toUpperCase()}`;
    document.getElementById('case-dept').innerText = data.dept.toUpperCase();
    document.getElementById('case-desc').innerText = data.desc;
    document.getElementById('case-hint').innerText = `HINT: ${data.hint}`;
    document.getElementById('case-nav-count').innerText = `CASE ${index + 1} / 10`;
    
    // Input State
    const input = document.getElementById('codeInput');
    const feedback = document.getElementById('feedback-area');
    
    input.value = "";
    feedback.innerHTML = ""; // Clear feedback
    
    if(data.solved) {
        input.disabled = true;
        input.value = data.answer;
        input.classList.add('bg-green-50');
        feedback.innerHTML = `<span class="text-green-600 font-bold">CASE SOLVED in ${formatTime(180 - data.time)}</span>`;
        document.getElementById('timer-display').innerText = "SOLVED";
        document.getElementById('timer-display').classList.remove('animate-pulse', 'text-red-600');
        document.getElementById('timer-display').classList.add('text-green-600');
        clearInterval(timerInterval);
    } else {
        input.disabled = false;
        input.classList.remove('bg-green-50');
        input.focus();
        startCaseTimer(index);
    }
}

function startCaseTimer(index) {
    clearInterval(timerInterval);
    const timerDisplay = document.getElementById('timer-display');
    timerDisplay.classList.remove('text-green-600');
    timerDisplay.classList.add('text-red-600');

    timerInterval = setInterval(() => {
        if(cases[index].solved) return;

        cases[index].time--;
        const t = cases[index].time;
        
        // Update display
        timerDisplay.innerText = formatTime(t);

        if(t <= 0) {
            clearInterval(timerInterval);
            timerDisplay.innerText = "TIME UP";
            document.getElementById('codeInput').disabled = true;
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
    const input = document.getElementById('codeInput').value.toUpperCase().trim();
    const data = cases[currentCaseIndex];
    const feedback = document.getElementById('feedback-area');

    if(input === data.answer) {
        // Correct
        data.solved = true;
        data.timeTaken = 180 - data.time;
        clearInterval(timerInterval);
        
        feedback.innerHTML = `<span class="text-green-600 font-bold">✓ CORRECT DIAGNOSIS</span>`;
        document.getElementById('timer-display').innerText = "SOLVED";
        document.getElementById('codeInput').classList.add('bg-green-50');
        document.getElementById('codeInput').disabled = true;

        checkCompletion();
    } else {
        // Incorrect
        feedback.innerHTML = `<span class="text-red-600 font-bold">⚠ INCORRECT CODE. TRY AGAIN.</span>`;
    }
}

// --- RESULTS LOGIC ---
function checkCompletion() {
    const allSolved = cases.every(c => c.solved);
    const timeUp = cases.every(c => c.time <= 0 || c.solved);

    if (allSolved || timeUp) {
        setTimeout(showResults, 1500);
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
        
        if(c.solved) totalScore += 100;
        if(c.solved) totalTime += c.timeTaken;

        tableHTML += `
            <tr class="border-b ${rowClass}">
                <td class="p-3 font-bold text-slate-700">${c.id}</td>
                <td class="p-3 text-sm">${c.title} <br> <span class="text-xs text-slate-500">Code: ${c.answer}</span></td>
                <td class="p-3 text-center">${statusIcon}</td>
                <td class="p-3 text-right font-mono text-xs">${timeDisplay}</td>
            </tr>
        `;
    });

    document.getElementById('final-score').innerText = totalScore + " XP";
    document.getElementById('total-time').innerText = formatTime(totalTime);
    document.getElementById('results-body').innerHTML = tableHTML;
}
