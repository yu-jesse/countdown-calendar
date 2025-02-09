let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function getOregonTime() {
    const oregonOffset = -8 * 60; // UTC offset for Oregon (Pacific Standard Time)
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
            dayDiv.classList.toggle('work');
            const checkbox = dayDiv.querySelector('.checkbox');
            if (!checkbox) {
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
        };

        calendarContainer.appendChild(dayDiv);
    }

    loadCalendarState();
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}

function saveCalendarState() {
    const workDays = JSON.parse(localStorage.getItem('workDays')) || [];
    const checkedDays = JSON.parse(localStorage.getItem('checkedDays')) || [];
    document.querySelectorAll('#calendar .day.work').forEach(div => {
        const workDay = { day: div.innerText, month: currentMonth, year: currentYear };
        if (!workDays.some(d => d.day == workDay.day && d.month == workDay.month && d.year == workDay.year)) {
            workDays.push(workDay);
        }
        if (div.classList.contains('checked')) {
            if (!checkedDays.some(d => d.day == workDay.day && d.month == workDay.month && d.year == workDay.year)) {
                checkedDays.push(workDay);
            }
        }
    });
    localStorage.setItem('workDays', JSON.stringify(workDays));
    localStorage.setItem('checkedDays', JSON.stringify(checkedDays));
}

function loadCalendarState() {
    const workDays = JSON.parse(localStorage.getItem('workDays')) || [];
    const checkedDays = JSON.parse(localStorage.getItem('checkedDays')) || [];
    const dayDivs = document.querySelectorAll('#calendar .day');
    dayDivs.forEach(div => {
        const dayInfo = { day: div.innerText, month: currentMonth, year: currentYear };
        if (workDays.some(d => d.day == dayInfo.day && d.month == dayInfo.month && d.year == dayInfo.year)) {
            div.classList.add('work');
        }
        if (checkedDays.some(d => d.day == dayInfo.day && d.month == dayInfo.month && d.year == dayInfo.year)) {
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
    const workDays = JSON.parse(localStorage.getItem('workDays')) || [];
    const checkedDays = JSON.parse(localStorage.getItem('checkedDays')) || [];
    const shiftsLeft = workDays.length - checkedDays.length;
    document.getElementById('shiftCountdown').innerText = `Shifts left: ${shiftsLeft}`;
}

function confettiEffect() {
    for (let i = 0; i < 100; i++) {
        let confetti = document.createElement('div');
        confetti.classList.add('confetti');
        document.body.appendChild(confetti);

        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = Math.random() * window.innerHeight + 'px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        setTimeout(() => { confetti.remove(); }, 3000); // Remove confetti after 3 seconds
    }
}

window.onload = function () {
    generateCalendar(currentMonth, currentYear);
};
