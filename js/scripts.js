// This file contains JavaScript code for handling user interactions, form submissions, and attendance marking functionality.

document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const attendanceForm = document.getElementById('attendance-form');
    const attendanceTable = document.getElementById('attendance-table');
    const adminAttendanceTable = document.getElementById('admin-attendance-table');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(registrationForm);
            const userInfo = {};
            formData.forEach((value, key) => {
                userInfo[key] = value;
            });
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(userInfo);
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful!');
            registrationForm.reset();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', username);
                alert('Login successful!');
                window.location.href = 'attendance.html';
            } else {
                alert('Invalid username or password.');
            }
        });
    }

    if (attendanceForm) {
        attendanceForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const attendanceData = new FormData(attendanceForm);
            const attendanceInfo = {};
            attendanceData.forEach((value, key) => {
                attendanceInfo[key] = value;
            });
            const loggedInUser = localStorage.getItem('loggedInUser');
            attendanceInfo['username'] = loggedInUser;
            let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
            attendanceRecords.push(attendanceInfo);
            localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
            alert('Attendance marked successfully!');
            attendanceForm.reset();
        });
    }

    if (attendanceTable) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
        const userAttendanceRecords = attendanceRecords.filter(record => record.username === loggedInUser);
        const tbody = attendanceTable.querySelector('tbody');
        userAttendanceRecords.forEach(record => {
            const row = document.createElement('tr');
            const dateCell = document.createElement('td');
            const statusCell = document.createElement('td');
            dateCell.textContent = record.date;
            statusCell.textContent = record.status;
            row.appendChild(dateCell);
            row.appendChild(statusCell);
            tbody.appendChild(row);
        });
    }

    if (adminAttendanceTable) {
        const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
        const tbody = adminAttendanceTable.querySelector('tbody');
        attendanceRecords.forEach(record => {
            const row = document.createElement('tr');
            const usernameCell = document.createElement('td');
            const dateCell = document.createElement('td');
            const statusCell = document.createElement('td');
            usernameCell.textContent = record.username;
            dateCell.textContent = record.date;
            statusCell.textContent = record.status;
            row.appendChild(usernameCell);
            row.appendChild(dateCell);
            row.appendChild(statusCell);
            tbody.appendChild(row);
        });
    }
});

function captureEntryTime() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter a username');
        return;
    }

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const status = 'Present'; // You can change this based on your logic

    const table = document.getElementById('admin-attendance-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const usernameCell = newRow.insertCell(0);
    const dateCell = newRow.insertCell(1);
    const timeCell = newRow.insertCell(2);
    const statusCell = newRow.insertCell(3);

    usernameCell.textContent = username;
    dateCell.textContent = date;
    timeCell.textContent = time;
    statusCell.textContent = status;
}