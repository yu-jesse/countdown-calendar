document.addEventListener("DOMContentLoaded", function () {
    const monthSelector = document.getElementById("monthButtons");
    const yearSelector = document.getElementById("yearSelector");
    const todayBtn = document.getElementById("today-btn");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    const currentMonthDisplay = document.getElementById("current-month");
    const shiftCountDisplay = document.getElementById("shift-count");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    let currentDate = new Date();

    // 🌙 Dark Mode Toggle
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
    });

    // 📅 Ensure Sidebar Month/Year Selection Persists
    const savedMonth = localStorage.getItem("selectedMonth");
    const savedYear = localStorage.getItem("selectedYear");

    if (savedMonth !== null) currentDate.setMonth(parseInt(savedMonth));
    if (savedYear !== null) currentDate.setFullYear(parseInt(savedYear));

    function updateCalendar() {
        currentMonthDisplay.textContent = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
        localStorage.setItem("selectedMonth", currentDate.getMonth());
        localStorage.setItem("selectedYear", currentDate.getFullYear());
    }

    prevMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    todayBtn.addEventListener("click", function () {
        currentDate = new Date();
        updateCalendar();
    });

    monthSelector.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON") {
            currentDate.setMonth(parseInt(event.target.dataset.month));
            updateCalendar();
        }
    });

    yearSelector.addEventListener("change", function () {
        currentDate.setFullYear(parseInt(yearSelector.value));
        updateCalendar();
    });

    updateCalendar();
});

// 🎉 Confetti Effect
function confettiEffect() {
    for (let i = 0; i < 100; i++) {
        let confetti = document.createElement("div");
        confetti.classList.add("confetti");
        document.body.appendChild(confetti);

        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.top = Math.random() * window.innerHeight + "px";
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        setTimeout(() => confetti.remove(), 2000);
    }
}

// Trigger Confetti When a Workday is Checked
document.addEventListener("change", function (event) {
    if (event.target.classList.contains("checkbox") && event.target.checked) {
        confettiEffect();
    }
});
