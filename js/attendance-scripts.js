let entryCount = 1;

function addAttendanceEntry() {
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('attendance-entry');

    entryDiv.innerHTML = `
        <label for="attendance-date">Select Date:</label>
        <input type="date" class="attendance-date">
        <br>
        <label for="attendance-status">Select Status:</label>
        <input type="radio" class="attendance-status" name="attendance-status-${entryCount}" value="Present" checked>
        <label for="present">Present</label>
        <input type="radio" class="attendance-status" name="attendance-status-${entryCount}" value="Absent">
        <label for="absent">Absent</label>
        <br>
        <button type="button" onclick="removeAttendanceEntry(this)">Remove</button>
    `;

    document.getElementById('attendance-entries').appendChild(entryDiv);
    entryCount++;
}

function removeAttendanceEntry(button) {
    const entryDiv = button.parentElement;
    entryDiv.remove();
}

function markAttendance() {
    const username = getUsernameFromSession();
    if (!username) {
        alert('User is not logged in');
        return;
    }

    const startDateInput = document.getElementById('attendance-start-date').value;
    const endDateInput = document.getElementById('attendance-end-date').value;
    const statusInput = document.querySelector('input[name="attendance-status"]:checked').value;
    const selectedSeat = document.querySelector('.seat.selected');

    if (!startDateInput || !endDateInput) {
        alert('Please select both start and end dates');
        return;
    }

    if (!selectedSeat) {
        alert('Please select a seat');
        return;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    if (startDate > endDate) {
        alert('Start date cannot be after end date');
        return;
    }

    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];

        // Check if the seat is already taken for the selected date
        const seatTaken = attendanceRecords.some(record => record.date === dateString && record.seat === selectedSeat.getAttribute('data-seat-number'));
        if (seatTaken) {
            alert(`Seat ${selectedSeat.getAttribute('data-seat-number')} is already taken for ${dateString}`);
            continue;
        }

        // Check if the attendance for the selected date already exists
        const attendanceExists = attendanceRecords.some(record => record.username === username && record.date === dateString);
        if (attendanceExists) {
            alert(`Attendance for ${dateString} is already marked`);
            continue;
        }

        const now = new Date();
        const time = now.toLocaleTimeString();

        const attendanceData = {
            username: username,
            date: dateString,
            time: time,
            status: statusInput,
            seat: selectedSeat.getAttribute('data-seat-number')
        };

        attendanceRecords.push(attendanceData);
    }

    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    fetchAttendanceReport(); // Refresh the attendance report
    updateSeatMap(); // Update the seat map to reflect the new assignments
}

function fetchAttendanceReport() {
    const username = getUsernameFromSession();
    if (!username) {
        alert('User is not logged in');
        return;
    }

    // Retrieve the attendance data from localStorage
    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    attendanceRecords = attendanceRecords.filter(record => record.username === username);

    const tableBody = document.getElementById('user-attendance-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing data

    attendanceRecords.forEach(record => {
        const newRow = tableBody.insertRow();

        const dateCell = newRow.insertCell(0);
        const timeCell = newRow.insertCell(1);
        const statusCell = newRow.insertCell(2);
        const seatCell = newRow.insertCell(3);
        const removeCell = newRow.insertCell(4);

        dateCell.textContent = record.date;
        timeCell.textContent = record.time;
        statusCell.textContent = record.status;
        seatCell.textContent = record.seat;
        removeCell.innerHTML = `<button onclick="removeAttendance('${record.date}')">Remove</button>`;
    });
}

function removeAttendance(date) {
    const username = getUsernameFromSession();
    if (!username) {
        alert('User is not logged in');
        return;
    }

    // Retrieve the attendance data from localStorage
    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    attendanceRecords = attendanceRecords.filter(record => !(record.username === username && record.date === date));

    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    fetchAttendanceReport(); // Refresh the attendance report
    updateSeatMap(); // Update the seat map to reflect the removed assignments
}

function getUsernameFromSession() {
    return sessionStorage.getItem('username'); // Retrieve the username from sessionStorage
}

document.addEventListener('DOMContentLoaded', () => {
    generateSeatMap();
    fetchAttendanceReport();
});

function generateSeatMap() {
    const seatMap = document.getElementById('seat-map');
    const totalRows = 8;
    const seatsPerRow = 10;

    // Clear any existing seats
    seatMap.innerHTML = '';

    let seatCounter = 1;

    for (let row = 1; row <= totalRows; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('seat-row');

        if (row === 1) {
            // First row: only seats 1, 2, 3
            for (let seatNumber = 1; seatNumber <= 3; seatNumber++) {
                const seat = document.createElement('div');
                seat.classList.add('seat', 'default');
                seat.setAttribute('data-seat-number', seatCounter++);
                seat.addEventListener('click', () => selectSeat(seat));
                rowDiv.appendChild(seat);
            }
            // Fill the rest of the row with empty spaces
            for (let i = 4; i <= seatsPerRow; i++) {
                const emptySpace = document.createElement('div');
                emptySpace.classList.add('seat-empty');
                rowDiv.appendChild(emptySpace);
            }
        } else if (row === 2) {
            // Second row: only seats 4, 5
            for (let seatNumber = 4; seatNumber <= 5; seatNumber++) {
                const seat = document.createElement('div');
                seat.classList.add('seat', 'default');
                seat.setAttribute('data-seat-number', seatCounter++);
                seat.addEventListener('click', () => selectSeat(seat));
                rowDiv.appendChild(seat);
            }
            // Fill the rest of the row with empty spaces
            for (let i = 6; i <= seatsPerRow; i++) {
                const emptySpace = document.createElement('div');
                emptySpace.classList.add('seat-empty');
                rowDiv.appendChild(emptySpace);
            }
        } else {
            // Remaining rows: first column with 4 seats, second column with 5 seats
            for (let seatNumber = 1; seatNumber <= 4; seatNumber++) {
                const seat = document.createElement('div');
                seat.classList.add('seat', 'default');
                seat.setAttribute('data-seat-number', seatCounter++);
                seat.addEventListener('click', () => selectSeat(seat));
                rowDiv.appendChild(seat);
            }
            const gap = document.createElement('div');
            gap.classList.add('seat-gap');
            rowDiv.appendChild(gap);
            for (let seatNumber = 5; seatNumber <= 9; seatNumber++) {
                const seat = document.createElement('div');
                seat.classList.add('seat', 'default');
                seat.setAttribute('data-seat-number', seatCounter++);
                seat.addEventListener('click', () => selectSeat(seat));
                rowDiv.appendChild(seat);
            }
        }
        seatMap.appendChild(rowDiv);
    }
    updateSeatMap();
}

function selectSeat(seat) {
    if (seat.classList.contains('taken')) {
        alert('This seat is already taken.');
        return;
    }
    const selectedSeat = document.querySelector('.seat.selected');
    if (selectedSeat) {
        selectedSeat.classList.remove('selected');
        selectedSeat.classList.add('default');
    }
    seat.classList.remove('default');
    seat.classList.add('selected');
}

function updateSeatMap() {
    const startDateInput = document.getElementById('attendance-start-date').value;
    const endDateInput = document.getElementById('attendance-end-date').value;
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    if (!startDateInput || !endDateInput || startDate > endDate) {
        return;
    }

    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const seats = document.querySelectorAll('.seat');

    seats.forEach(seat => {
        seat.classList.remove('taken');
        seat.classList.add('default');
        seat.removeAttribute('data-username');
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dateString = date.toISOString().split('T')[0];
            const record = attendanceRecords.find(record => record.date === dateString && record.seat === seat.getAttribute('data-seat-number'));
            if (record) {
                seat.classList.remove('default');
                seat.classList.add('taken');
                seat.setAttribute('data-username', `Taken by ${record.username}`);
                break;
            }
        }
    });
}

// Update the seat map when the date inputs change
document.getElementById('attendance-start-date').addEventListener('change', updateSeatMap);
document.getElementById('attendance-end-date').addEventListener('change', updateSeatMap);