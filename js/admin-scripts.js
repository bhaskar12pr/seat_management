document.addEventListener('DOMContentLoaded', () => {
    fetchAdminAttendanceReport();
    fetchRegisteredUsers();
    fetchCurrentUserAttendance();
});

function fetchAdminAttendanceReport() {
    // Retrieve the attendance data from localStorage
    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

    const tableBody = document.getElementById('admin-attendance-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing data

    attendanceRecords.forEach(record => {
        const newRow = tableBody.insertRow();

        const usernameCell = newRow.insertCell(0);
        const dateCell = newRow.insertCell(1);
        const timeCell = newRow.insertCell(2);
        const statusCell = newRow.insertCell(3);

        usernameCell.textContent = record.username;
        dateCell.textContent = record.date;
        timeCell.textContent = record.time;
        statusCell.textContent = record.status;
    });
}

function fetchRegisteredUsers() {
    // Retrieve the registered users data from localStorage
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    const tableBody = document.getElementById('admin-users-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing data

    registeredUsers.forEach(user => {
        const newRow = tableBody.insertRow();

        const usernameCell = newRow.insertCell(0);
        const emailCell = newRow.insertCell(1);
        const passwordCell = newRow.insertCell(2);
        const registrationDateCell = newRow.insertCell(3);
        const registrationTimeCell = newRow.insertCell(4);

        usernameCell.textContent = user.username;
        emailCell.textContent = user.email;
        passwordCell.textContent = user.password;
        registrationDateCell.textContent = user.registrationDate;
        registrationTimeCell.textContent = user.registrationTime;
    });
}

function fetchCurrentUserAttendance() {
    const username = getUsernameFromSession();
    if (!username) {
        alert('User is not logged in');
        return;
    }

    // Retrieve the attendance data from localStorage
    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    attendanceRecords = attendanceRecords.filter(record => record.username === username);

    const tableBody = document.getElementById('current-user-attendance-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing data

    attendanceRecords.forEach(record => {
        const newRow = tableBody.insertRow();

        const dateCell = newRow.insertCell(0);
        const timeCell = newRow.insertCell(1);
        const statusCell = newRow.insertCell(2);

        dateCell.textContent = record.date;
        timeCell.textContent = record.time;
        statusCell.textContent = record.status;
    });
}

function getUsernameFromSession() {
    return sessionStorage.getItem('username'); // Retrieve the username from sessionStorage
}