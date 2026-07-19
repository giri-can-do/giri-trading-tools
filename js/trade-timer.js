const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const customMinutes = document.getElementById("customMinutes");

const remainingTime = document.getElementById("remainingTime");
const elapsedTime = document.getElementById("elapsedTime");
const timerStatus = document.getElementById("timerStatus");

const presetButtons = document.querySelectorAll(".preset-btn");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const disciplineReminder = document.getElementById("disciplineReminder");

let timer = null;

let totalSeconds = 0;
let remainingSeconds = 0;
let elapsedSeconds = 0;

let isRunning = false;
let isPaused = false;



// Format Time
function formatTime(seconds){

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;

}

// Update Display
function updateDisplay() {
    remainingTime.textContent = formatTime(remainingSeconds);
    elapsedTime.textContent = formatTime(elapsedSeconds);

    const progress =
        totalSeconds > 0
            ? (elapsedSeconds / totalSeconds) * 100
            : 0;

    const safeProgress = Math.min(100, Math.max(0, progress));

    progressBar.style.width = `${safeProgress}%`;
    progressText.textContent = `${Math.floor(safeProgress)}%`;

    remainingTime.classList.remove(
        "timer-warning",
        "timer-critical"
    );

    progressBar.classList.remove(
        "progress-warning",
        "progress-critical"
    );

    if (isRunning && remainingSeconds <= 60) {
        remainingTime.classList.add("timer-critical");
        progressBar.classList.add("progress-critical");

        disciplineReminder.textContent =
            "Final minute. Manage existing positions only.";
    } else if (isRunning && remainingSeconds <= 300) {
        remainingTime.classList.add("timer-warning");
        progressBar.classList.add("progress-warning");

        disciplineReminder.textContent =
            "Final five minutes. Avoid forcing a new trade.";
    } else if (isRunning) {
        disciplineReminder.textContent =
            "Follow your plan. Do not chase the market.";
    }
}

// Select Duration
presetButtons.forEach(button => {

    button.addEventListener("click", () => {

        presetButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        customMinutes.value = "";

        totalSeconds = Number(button.dataset.minutes) * 60;

        remainingSeconds = totalSeconds;

        elapsedSeconds = 0;

        updateDisplay();

    });

});

// Custom Minutes
customMinutes.addEventListener("input", () => {

    presetButtons.forEach(btn => btn.classList.remove("active"));

    totalSeconds = Number(customMinutes.value) * 60;

    remainingSeconds = totalSeconds;

    elapsedSeconds = 0;

    updateDisplay();

});

// Start Timer
function startTimer() {

    if (isRunning || remainingSeconds <= 0) {
        return;
    }

    isRunning = true;
    isPaused = false;

    timerStatus.textContent = "🟢 Running";
    timerStatus.className = "status-running";

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;

    timer = setInterval(tick, 1000);

}

// Tick Function
function tick() {
    if (remainingSeconds <= 0) {
        finishTimer();
        return;
    }
    remainingSeconds--;
    elapsedSeconds++;
    updateDisplay();
}

// Finish Timer
function finishTimer() {
    clearInterval(timer);

    timer = null;
    isRunning = false;
    isPaused = false;
    remainingSeconds = 0;

    updateDisplay();

    timerStatus.textContent = "🔴 Finished";
    timerStatus.className = "status-finished";

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
    pauseBtn.textContent = "Pause";

    disciplineReminder.textContent = "Session complete. Review your trades and avoid revenge trading.";
    
    pauseBtn.classList.remove("btn-success");
    pauseBtn.classList.add("btn-secondary");

    alert(
        "🎉 Trading session complete!\n\n" +
        "Review your trades.\n" +
        "Avoid revenge trading.\n" +
        "Close the platform when your plan is complete."
    );
}

// Start Button
startBtn.addEventListener("click", startTimer);

// Pause / Resume
pauseBtn.addEventListener("click", function () {
    if (!isRunning && !isPaused) {
        return;
    }

    if (isRunning) {
        clearInterval(timer);

        isRunning = false;
        isPaused = true;

        pauseBtn.textContent = "Resume";
        timerStatus.textContent = "🟡 Paused";
        timerStatus.className = "status-paused";
        pauseBtn.classList.remove("btn-secondary");
        pauseBtn.classList.add("btn-success");

        disciplineReminder.textContent = "Stay patient. Resume only when you are ready.";

        return;
    }

    isRunning = true;
    isPaused = false;

    pauseBtn.textContent = "Pause";
    timerStatus.textContent = "🟢 Running";
    timerStatus.className = "status-running";
    pauseBtn.classList.remove("btn-success");
    pauseBtn.classList.add("btn-secondary");
    

    timer = setInterval(tick, 1000);

    disciplineReminder.textContent = "Follow your plan. Do not chase the market.";
});

// Reset Button
resetBtn.addEventListener("click", function () {
    clearInterval(timer);

    timer = null;
    totalSeconds = 0;
    remainingSeconds = 0;
    elapsedSeconds = 0;
    isRunning = false;
    isPaused = false;

    customMinutes.value = "";

    presetButtons.forEach(function (button) {
        button.classList.remove("active");
    });

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;

    pauseBtn.textContent = "Pause";

    timerStatus.textContent = "Ready";
    timerStatus.className = "status-ready";

    updateDisplay();
});

// Initial button state
pauseBtn.disabled = true;
resetBtn.disabled = true;