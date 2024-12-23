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

    if (!startDateInput || !endDateInput) {
        alert('Please select both start and end dates');
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
            status: statusInput
        };

        attendanceRecords.push(attendanceData);
    }

    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    fetchAttendanceReport(); // Refresh the attendance report
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
        const removeCell = newRow.insertCell(3);

        dateCell.textContent = record.date;
        timeCell.textContent = record.time;
        statusCell.textContent = record.status;
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
}

function getUsernameFromSession() {
    return sessionStorage.getItem('username'); // Retrieve the username from sessionStorage
}

// Fetch the attendance report when the page loads
document.addEventListener('DOMContentLoaded', fetchAttendanceReport);