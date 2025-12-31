// Auto-run logic when page loads
document.addEventListener('DOMContentLoaded', () => {
    // If we are on the Arena page (timer exists), start the game
    if (document.getElementById('timer')) {
        startTimer();
    }
});

// --- TIMER LOGIC ---
let timerInterval;

function startTimer() {
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

// --- SUBMISSION LOGIC ---
function submitCode() {
    const input = document.getElementById('codeInput').value.toUpperCase().trim();
    const consoleDiv = document.getElementById('consoleOutput');
    
    consoleDiv.innerHTML += `<br>> Analyzing syntax...`;
    consoleDiv.innerHTML += `<br>> Querying ICD-10 Database...`;
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    
    setTimeout(() => {
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
    }, 800);
}
