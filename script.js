// Global variables
if (typeof window.currentMonth === 'undefined') {
    window.currentMonth = new Date().getMonth();
    window.currentYear = new Date().getFullYear();
}

function initializeCalendar() {
    createSidebar();
    const savedDate = JSON.parse(localStorage.getItem('lastViewedDate'));
    if (savedDate) {
        window.currentMonth = savedDate.month;
        window.currentYear = savedDate.year;
    }
    generateCalendar(window.currentMonth, window.currentYear);
}

// 🛠 Function to generate sidebar
function createSidebar() {
    const monthButtons = document.getElementById('monthButtons');
    const yearSelector = document.getElementById('yearSelector');

    // Add month buttons
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthNames.forEach((month, index) => {
        const btn = document.createElement('button');
        btn.innerText = month;
        btn.onclick = () => jumpToMonth(index);
        monthButtons.appendChild(btn);
    });

    // Populate year dropdown (range 2000 - 2050)
    for (let year = 2000; year <= 2050; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.innerText = year;
        yearSelector.appendChild(option);
    }

    // Set default selected year
    yearSelector.value = window.currentYear;
    yearSelector.onchange = () => jumpToYear(yearSelector.value);

    // Today button functionality
    document.getElementById('todayButton').onclick = jumpToToday;
}

function jumpToMonth(month) {
    window.currentMonth = month;
    generateCalendar(window.currentMonth, window.currentYear);
}

function jumpToYear(year) {
    window.currentYear = parseInt(year);
    generateCalendar(window.currentMonth, window.currentYear);
}

function jumpToToday() {
    const today = new Date();
    window.currentMonth = today.getMonth();
    window.currentYear = today.getFullYear();
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

        dayDiv.onclick = function () {
            toggleWorkday(dayDiv, day);
        };

        calendarContainer.appendChild(dayDiv);
    }

    loadCalendarState();
}

function prevMonth() {
    window.currentMonth--;
    if (window.currentMonth < 0) {
        window.currentMonth = 11;
        window.currentYear--;
    }
    generateCalendar(window.currentMonth, window.currentYear);
}

function nextMonth() {
    window.currentMonth++;
    if (window.currentMonth > 11) {
        window.currentMonth = 0;
        window.currentYear++;
    }
    generateCalendar(window.currentMonth, window.currentYear);
}

window.onload = initializeCalendar;
