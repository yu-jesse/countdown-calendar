function getOregonTime() {
    const oregonOffset = -8 * 60; // UTC offset for Oregon (Pacific Standard Time)
    const currentUtcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    return new Date(currentUtcTime + oregonOffset * 60000);
}

function generateCalendar() {
    const calendarContainer = document.getElementById('calendar');
    const today = getOregonTime();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    calendarContainer.innerHTML = '';
    for (let i = 0; i < firstDay; i++) {
        calendarContainer.appendChild(document.createElement('div')); // Empty spaces for alignment
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.innerText = day;
        if (day === today.getDate()) {
            dayDiv.classList.add('highlight');
        }
        dayDiv.onclick = function() {
            if (dayDiv.classList.contains('work')) {
                dayDiv.classList.toggle('checked');
                saveCalendarState();
                confettiEffect();
                updateShiftCountdown();
            }
        };
        calendarContainer.appendChild(dayDiv);
    }
    loadCalendarState();
}

function addWorkDay() {
    const day = prompt('Enter the day of the month you want to mark as a work day:');
    if (day) {
        const dayDivs = document.querySelectorAll('#calendar .day');
        dayDivs.forEach(div => {
            if (div.innerText == day) {
                div.classList.add('work');
                saveCalendarState();
                updateShiftCountdown();
            }
        });
    }
}

function saveCalendarState() {
    const workDays = [];
    const checkedDays = [];
    document.querySelectorAll('#calendar .day.work').forEach(div => {
        workDays.push(div.innerText);
        if (div.classList.contains('checked')) {
            checkedDays.push(div.innerText);
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
        if (workDays.includes(div.innerText)) {
            div.classList.add('work');
        }
        if (checkedDays.includes(div.innerText)) {
            div.classList.add('checked');
        }
    });
    updateShiftCountdown();
}

function updateShiftCountdown() {
    const workDays = document.querySelectorAll('#calendar .work');
    const checkedDays = document.querySelectorAll('#calendar .work.checked');
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

window.onload = function() {
    generateCalendar();
};
