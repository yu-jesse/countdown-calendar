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

function generateCalendar(month, year) {
    const calendarContainer = document.getElementById('calendar');
    const monthYearDisplay = document.getElementById('monthYear');
    const today = new Date();
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

function updateShiftCountdown() {
    let totalWorkDays = 0;
    let totalCheckedDays = 0;

    // Loop through all stored keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        // Only process keys related to calendar data
        if (key.startsWith('calendar_')) {
            const storedData = JSON.parse(localStorage.getItem(key)) || { workDays: [], checkedDays: [] };
            totalWorkDays += storedData.workDays.length;
            totalCheckedDays += storedData.checkedDays.length;
        }
    }

    // Calculate shifts left
    const shiftsLeft = totalWorkDays - totalCheckedDays;
    document.getElementById('shiftCountdown').innerText = `Shifts left: ${shiftsLeft}`;
}

// Run initialization when the page loads
window.onload = initializeCalendar;
