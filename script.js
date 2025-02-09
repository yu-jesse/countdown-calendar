// Ensure global variables are only declared once
if (typeof window.currentMonth === 'undefined') {
    window.currentMonth = new Date().getMonth();
    window.currentYear = new Date().getFullYear();
}

function initializeCalendar() {
    const savedDate = JSON.parse(localStorage.getItem('lastViewedDate'));
    if (savedDate) {
        window.currentMonth = savedDate.month;
        window.currentYear = savedDate.year;
    }
    generateCalendar(window.currentMonth, window.currentYear);
}

function getOregonTime() {
    const oregonOffset = -8 * 60; // UTC offset for PST
    const currentUtcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    return new Date(currentUtcTime + oregonOffset * 60000);
}

function generateCalendar(month, year) {
    const calendarContainer = document.getElementById('calendar');
    const monthYearDisplay = document.getElementById('monthYear');
    const today = getOregonTime();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    calendarContainer.innerHTML = '';
    monthYearDisplay.innerText = `${monthNames[month]} ${year}`;

    for (let i = 0; i < firstDay; i++) {
        calendarContainer.appendChild(document.createElement('div')); // Empty spaces for alignment
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.innerText = day;

        if (month === today.getMonth() && year === today.getFullYear() && day === today.getDate()) {
            dayDiv.classList.add('highlight');
        }

        dayDiv.onclick = function () {
            toggleWorkday(dayDiv, day);
        };

        calendarContainer.appendChild(dayDiv);
    }

    loadCalendarState();
}

function toggleWorkday(dayDiv, day) {
    dayDiv.classList.toggle('work');
    if (!dayDiv.querySelector('.checkbox')) {
        const checkBoxElement = document.createElement('input');
        checkBoxElement.type = 'checkbox';
        checkBoxElement.classList.add('checkbox');
        checkBoxElement.onclick = function (event) {
            event.stopPropagation();
            dayDiv.classList.toggle('checked');
            saveCalendarState();
            confettiEffect();
            updateShiftCountdown();
        };
        dayDiv.appendChild(checkBoxElement);
    }
    saveCalendarState();
    updateShiftCountdown();
}

function prevMonth() {
    window.currentMonth--;
    if (window.currentMonth < 0) {
        window.currentMonth = 11;
        window.currentYear--;
    }
    generateCalendar(window.currentMonth, window.currentYear);
    saveLastViewedDate();
}

function nextMonth() {
    window.currentMonth++;
    if (window.currentMonth > 11) {
        window.currentMonth = 0;
        window.currentYear++;
    }
    generateCalendar(window.currentMonth, window.currentYear);
    saveLastViewedDate();
}

function saveLastViewedDate() {
    localStorage.setItem('lastViewedDate', JSON.stringify({ month: window.currentMonth, year: window.currentYear }));
}

function saveCalendarState() {
    const workDays = [];
    const checkedDays = [];
    document.querySelectorAll('#calendar .day.work').forEach(div => {
        const dayInfo = { day: div.innerText, month: window.currentMonth, year: window.currentYear };
        workDays.push(dayInfo);
        if (div.classList.contains('checked')) {
            checkedDays.push(dayInfo);
        }
    });

    const key = `calendar_${window.currentMonth}_${window.currentYear}`;
    localStorage.setItem(key, JSON.stringify({ workDays, checkedDays }));
    updateShiftCountdown();
}

function loadCalendarState() {
    const key = `calendar_${window.currentMonth}_${window.currentYear}`;
    const storedData = JSON.parse(localStorage.getItem(key)) || { workDays: [], checkedDays: [] };
    const dayDivs = document.querySelectorAll('#calendar .day');

    dayDivs.forEach(div => {
        const day = div.innerText;
        if (!day) return;

        if (storedData.workDays.some(d => d.day == day)) {
            div.classList.add('work');
        }

        if (storedData.checkedDays.some(d => d.day == day)) {
            div.classList.add('checked');
            if (!div.querySelector('.checkbox')) {
                const checkBoxElement = document.createElement('input');
                checkBoxElement.type = 'checkbox';
                checkBoxElement.classList.add('checkbox');
                checkBoxElement.checked = true;
                checkBoxElement.onclick = function (event) {
                    event.stopPropagation();
                    div.classList.toggle('checked');
                    saveCalendarState();
                    confettiEffect();
                    updateShiftCountdown();
                };
                div.appendChild(checkBoxElement);
            }
        }
    });

    updateShiftCountdown();
}

function updateShiftCountdown() {
    const key = `calendar_${window.currentMonth}_${window.currentYear}`;
    const storedData = JSON.parse(localStorage.getItem(key)) || { workDays: [], checkedDays: [] };
    const shiftsLeft = storedData.workDays.length - storedData.checkedDays.length;
    document.getElementById('shiftCountdown').innerText = `Shifts left: ${shiftsLeft}`;
}

function confettiEffect() {
    for (let i = 0; i < 30; i++) {
        let confetti = document.createElement('div');
        confetti.classList.add('confetti');
        document.body.appendChild(confetti);

        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = Math.random() * window.innerHeight + 'px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        setTimeout(() => confetti.remove(), 2000);
    }
}

// Run initialization when the page loads
window.onload = initializeCalendar;