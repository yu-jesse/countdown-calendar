// Ensure global variables exist once
if (typeof window.currentMonth === 'undefined') {
    window.currentMonth = new Date().getMonth();
    window.currentYear = new Date().getFullYear();
}

// 🛠 Function to generate sidebar (Buttons & Year Selector)
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
    yearSelector.onchange = () => changeYear(yearSelector.value);

    // Today button functionality
    document.getElementById('todayButton').onclick = jumpToToday;
}

function jumpToMonth(selectedMonth) {
    // ✅ Remove highlight from all month buttons
    document.querySelectorAll("#monthButtons button").forEach(btn => btn.classList.remove("active"));

    // ✅ Set new active button
    currentMonth = selectedMonth;
    localStorage.setItem("selectedMonth", currentMonth);
    generateCalendar(currentMonth, currentYear);

    // ✅ Highlight the selected month button
    event.target.classList.add("active");
}


function changeYear() {
    currentYear = parseInt(document.getElementById("yearSelector").value, 10);
    localStorage.setItem("selectedYear", currentYear); // ✅ Store year
    generateCalendar(currentMonth, currentYear); // ✅ Refresh calendar
}


function jumpToToday() {
    const today = new Date();
    window.currentMonth = today.getMonth();
    window.currentYear = today.getFullYear();
    generateCalendar(window.currentMonth, window.currentYear);
}

// 🛠 Ensure loadCalendarState() is defined BEFORE generateCalendar()
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
            div.querySelector('.checkbox').checked = true;
        }
    });

    updateShiftCountdown();
}


function generateCalendar(month, year) {
    const calendarContainer = document.getElementById('calendar');
    const monthYearDisplay = document.getElementById('monthYear');
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // ✅ Reset calendar display
    calendarContainer.innerHTML = '';
    monthYearDisplay.innerText = `${monthNames[month]} ${year}`;

    // ✅ Generate Empty Spaces for Alignment
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty');
        calendarContainer.appendChild(emptyDiv);
    }

    // ✅ Generate Calendar Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.innerText = day;

        // ✅ Highlight Today
        if (month === today.getMonth() && year === today.getFullYear() && day === today.getDate()) {
            dayDiv.classList.add('highlight');
        }

        // ✅ Checkbox for Workdays
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

        // ✅ Handle Workday Selection
        dayDiv.onclick = function () {
            toggleWorkday(dayDiv, day);
        };

        calendarContainer.appendChild(dayDiv);
    }

    // ✅ Load Saved Data
    loadCalendarState();
}



function toggleWorkday(dayDiv, day) {
    dayDiv.classList.toggle('work');
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

function updateShiftCountdown() {
    let totalWorkDays = 0;
    let totalCheckedDays = 0;

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key.startsWith('calendar_')) {
            const storedData = JSON.parse(localStorage.getItem(key)) || { workDays: [], checkedDays: [] };
            totalWorkDays += storedData.workDays.length;
            totalCheckedDays += storedData.checkedDays.length;
        }
    }

    const shiftsLeft = totalWorkDays - totalCheckedDays;
    document.getElementById('shiftCountdown').innerText = `Shifts left: ${shiftsLeft}`;
}

function createSidebar() {
    const monthButtons = document.getElementById("monthButtons");
    monthButtons.innerHTML = ""; // ✅ Clear previous buttons before adding new ones

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthNames.forEach((month, index) => {
        const btn = document.createElement("button");
        btn.innerText = month;
        btn.onclick = () => jumpToMonth(index);
        monthButtons.appendChild(btn);
    });

    console.log("Sidebar buttons created:", monthButtons.innerHTML); // ✅ Debugging
}

window.onload = function () {
    createSidebar(); // ✅ Make sure sidebar buttons are created
    const savedMonth = localStorage.getItem("selectedMonth");
    const savedYear = localStorage.getItem("selectedYear");

    if (savedMonth !== null && savedYear !== null) {
        currentMonth = parseInt(savedMonth, 10);
        currentYear = parseInt(savedYear, 10);
    }

    generateCalendar(currentMonth, currentYear);
    updateShiftCountdown(); // ✅ Ensure shift count updates when page loads
};
