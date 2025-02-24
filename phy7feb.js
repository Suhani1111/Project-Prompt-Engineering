const canvas = document.getElementById("pendulumCanvas");
const ctx = canvas.getContext("2d");

// Pendulum properties
let length = 200;
let mass = 10;
let angle = Math.PI / 4;
let angularVelocity = 0;
let angularAcceleration = 0;
let gravity = 9.81;
let damping = 0.99;
let isAnimating = false;
let oscillationCount = 0;
let lastAngle = angle;
let timer = 0;
let interval;

const pivotX = canvas.width / 2;
const pivotY = 50;

function calculateTimePeriod() {
    return 2 * Math.PI * Math.sqrt(length / gravity);
}

function updatePendulum() {
    if (!isAnimating) return;

    angularAcceleration = (-gravity / length) * Math.sin(angle);
    angularVelocity *= damping;
    angularVelocity += angularAcceleration;
    angle += angularVelocity;

    if (lastAngle < 0 && angle > 0) {
        oscillationCount++;
    }
    lastAngle = angle;

    let bobX = pivotX + length * Math.sin(angle);
    let bobY = pivotY + length * Math.cos(angle);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pivot
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw string
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Draw bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, mass * 2, 0, 2 * Math.PI);
    ctx.fill();

    document.getElementById("oscillationCount").innerText = `Oscillations: ${oscillationCount}`;
}

function animate() {
    updatePendulum();
    if (isAnimating) {
        requestAnimationFrame(animate);
    }
}

function startPendulum() {
    if (!isAnimating) {
        isAnimating = true;
        interval = setInterval(() => {
            timer++;
            document.getElementById("timePeriod").innerText = `Time Period: ${calculateTimePeriod().toFixed(2)} s`;
        }, 1000);
        animate();
    }
}

function stopPendulum() {
    isAnimating = false;
    clearInterval(interval);
}

function restartPendulum() {
    stopPendulum();
    angle = Math.PI / 4;
    angularVelocity = 0;
    angularAcceleration = 0;
    oscillationCount = 0;
    timer = 0;
    document.getElementById("oscillationCount").innerText = "Oscillations: 0";
    document.getElementById("timePeriod").innerText = "Time Period: 0 s";
}

// Event listeners
document.getElementById("startButton").addEventListener("click", startPendulum);
document.getElementById("stopButton").addEventListener("click", stopPendulum);
document.getElementById("restartButton").addEventListener("click", restartPendulum);

// Slider Controls
document.getElementById("lengthSlider").addEventListener("input", function () {
    length = this.value;
    restartPendulum();
});

document.getElementById("massSlider").addEventListener("input", function () {
    mass = this.value;
    restartPendulum();
});

document.getElementById("frictionSlider").addEventListener("input", function () {
    damping = this.value;
    restartPendulum();
});
