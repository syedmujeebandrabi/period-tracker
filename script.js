document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const tipContainer = document.getElementById('tips-container');

    let startDate = localStorage.getItem('periodStartDate');

    if (!startDate) {
        const lastPeriodDate = localStorage.getItem('lastPeriodDate');
        if (lastPeriodDate) {
            startDate = prompt('Based on your previous record, your last period was on ' + lastPeriodDate + '. Please enter the start date of your current period (YYYY-MM-DD format):');
        } else {
            startDate = prompt('Please enter the start date of your last period (YYYY-MM-DD format):');
        }

        if (!startDate || !isValidDate(startDate)) {
            console.error('Invalid start date entered.');
            return;
        }

        localStorage.setItem('periodStartDate', startDate);
    }

    displayPeriodInfo(startDate);

    // Function to update menstrual tips every 5 seconds
    function rotateTips() {
        const menstrualTips = [
            'Stay hydrated and drink plenty of water during your period.',
            'Consider using heat packs to alleviate menstrual cramps.',
            'Maintain a healthy diet rich in iron and other nutrients.',
            'Practice stress-relief techniques to manage PMS symptoms.',
            'Get regular exercise to help reduce menstrual discomfort.',
            'Wash your hands before and after using the restroom and before using a menstrual product.',
            'Sanitary pads: Change sanitary pads every few hours, no matter how light the flow. Change them more frequently if your period is heavy.',
            'Wear lightweight, breathable clothing (such as cotton underwear). Tight fabrics can trap moisture and heat, allowing germs to thrive.',
            
        ];

        let index = 0;

        setInterval(() => {
            tipContainer.textContent = menstrualTips[index];
            index = (index + 1) % menstrualTips.length;
        }, 5000);
    }

    // Call the function to start rotating tips
    rotateTips();

    // FullCalendar initialization
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: generateCalendarEvents(),
        eventClick: function(info) {
            const confirmation = confirm("Did you get your period on this day?");
            if (confirmation) {
                localStorage.setItem('lastPeriodDate', info.dateStr);
                displayPeriodInfo(startDate);
            }
        }
    });

    calendar.render();
});

function isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;
    const d = new Date(dateString);
    const dNum = d.getTime();
    if(!dNum && dNum !== 0) return false;
    return d.toISOString().slice(0,10) === dateString;
}

function trackPeriod() {
    const startDateInput = document.getElementById('start-date');
    const resultDiv = document.getElementById('result');

    const startDate = startDateInput.value;

    if (!startDate || !isValidDate(startDate)) {
        resultDiv.textContent = 'Please enter a valid start date (YYYY-MM-DD format).';
        return;
    }

    localStorage.setItem('periodStartDate', startDate);
    displayPeriodInfo(startDate);
}

function displayPeriodInfo(startDate) {
    const today = new Date();
    const startDateObj = new Date(startDate);
    const cycleLength = 28; // Adjust this according to user's typical cycle length

    const nextPeriodDate = new Date(startDateObj.getTime() + cycleLength * 24 * 60 * 60 * 1000);
    const diffTime = Math.abs(nextPeriodDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysRemaining = diffDays % cycleLength;

    const lastPeriodDate = localStorage.getItem('lastPeriodDate');
    const lastPeriodDateString = lastPeriodDate ? new Date(lastPeriodDate).toDateString() : "N/A";

    const resultDiv = document.getElementById('result');
    resultDiv.textContent = `Last period: ${lastPeriodDateString}, Next period: ${nextPeriodDate.toDateString()} (${daysRemaining} days remaining)`;
}

function generateCalendarEvents() {
    const events = [];

    // Retrieve stored data from local storage or any other source
    const startDate = localStorage.getItem('periodStartDate');

    if (startDate) {
        // Generate events based on the stored start date
        // For example, you can calculate and add events for the entire year
        // Here's just a basic example for the current month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const exampleData = [
            { start: `${currentYear}-${currentMonth}-01`, title: 'Period Start' },
            { start: `${currentYear}-${currentMonth}-15`, title: 'Period Start' },
            // Add more events as needed
        ];

        exampleData.forEach(event => {
            events.push({
                title: event.title,
                start: event.start,
                allDay: true,
            });
        });
    }

    return events;
}
