document.addEventListener('DOMContentLoaded', () => {
    fetchAttendanceRecords();
    generateSeatMap();
    fetchRegisteredUsers();
    populateDateDropdown();
    generateAttendanceChart();
    generateUserRegistrationChart();
});

function displayUsers() {
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const tableBody = document.getElementById('user-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing data

    registeredUsers.forEach(user => {
        const newRow = tableBody.insertRow();

        const usernameCell = newRow.insertCell(0);
        const emailCell = newRow.insertCell(1);
        const departmentCell = newRow.insertCell(2);
        const actionCell = newRow.insertCell(3);

        usernameCell.textContent = user.username;
        emailCell.textContent = user.email;
        departmentCell.textContent = user.department;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeUser(user.username);
        actionCell.appendChild(removeButton);
    });
}

function removeUser(username) {
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    registeredUsers = registeredUsers.filter(user => user.username !== username);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    fetchRegisteredUsers();
}

function fetchAttendanceRecords() {
    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const tableBody = document.getElementById('attendance-record-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing data

    attendanceRecords.forEach(record => {
        const newRow = tableBody.insertRow();

        const dateCell = newRow.insertCell(0);
        const usernameCell = newRow.insertCell(1);
        const statusCell = newRow.insertCell(2);
        const seatCell = newRow.insertCell(3);

        dateCell.textContent = record.date;
        usernameCell.textContent = record.username;
        statusCell.textContent = record.status;
        seatCell.textContent = record.seat;
    });
}

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
                rowDiv.appendChild(seat);
            }
            const gap = document.createElement('div');
            gap.classList.add('seat-gap');
            rowDiv.appendChild(gap);
            for (let seatNumber = 5; seatNumber <= 9; seatNumber++) {
                const seat = document.createElement('div');
                seat.classList.add('seat', 'default');
                seat.setAttribute('data-seat-number', seatCounter++);
                rowDiv.appendChild(seat);
            }
        }
        seatMap.appendChild(rowDiv);
    }

    updateSeatMap();
}

function updateSeatMap() {
    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const selectedDate = document.getElementById('seat-date').value;
    const seats = document.querySelectorAll('.seat');

    seats.forEach(seat => {
        seat.classList.remove('taken');
        seat.classList.add('default');
        seat.removeAttribute('data-username');
        const seatNumber = seat.getAttribute('data-seat-number');
        const record = attendanceRecords.find(record => record.seat === seatNumber && record.date === selectedDate);
        if (record) {
            seat.classList.remove('default');
            seat.classList.add('taken');
            seat.setAttribute('data-username', `Taken by ${record.username} on ${record.date}`);
        }
    });
}

function fetchRegisteredUsers() {
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const tableBody = document.getElementById('registered-users-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing data

    registeredUsers.forEach(user => {
        const newRow = tableBody.insertRow();

        const usernameCell = newRow.insertCell(0);
        const emailCell = newRow.insertCell(1);
        const passwordCell = newRow.insertCell(2);
        const departmentCell = newRow.insertCell(3);
        const roleCell = newRow.insertCell(4);
        const actionCell = newRow.insertCell(5);

        usernameCell.textContent = user.username;
        emailCell.textContent = user.email;
        passwordCell.textContent = user.password;
        departmentCell.textContent = user.department;
        roleCell.textContent = user.role;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeUser(user.username);
        actionCell.appendChild(removeButton);
    });
}

function populateDateDropdown() {
    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const dateDropdown = document.getElementById('seat-date');
    const uniqueDates = [...new Set(attendanceRecords.map(record => record.date))];

    uniqueDates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = date;
        dateDropdown.appendChild(option);
    });

    // Set the first date as selected and update the seat map
    if (uniqueDates.length > 0) {
        dateDropdown.value = uniqueDates[0];
        updateSeatMap();
    }
}

function generateAttendanceChart() {
    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const ctx = document.getElementById('attendance-chart').getContext('2d');

    // Filter records for the current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });

    // Count the number of people coming to the office each day
    const dailyCounts = {};
    monthlyRecords.forEach(record => {
        if (record.status === 'Present') {
            const date = record.date;
            if (!dailyCounts[date]) {
                dailyCounts[date] = 0;
            }
            dailyCounts[date]++;
        }
    });

    // Prepare data for the chart
    const labels = Object.keys(dailyCounts).sort();
    const data = labels.map(date => dailyCounts[date]);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of People',
                data: data,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
}

function generateUserRegistrationChart() {
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const ctx = document.getElementById('user-registration-chart').getContext('2d');

    // Filter records for the last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthYear = lastMonth.getFullYear();
    const lastMonthMonth = lastMonth.getMonth();

    const monthlyRecords = registeredUsers.filter(user => {
        const registrationDate = new Date(user.registrationDate);
        return registrationDate.getMonth() === lastMonthMonth && registrationDate.getFullYear() === lastMonthYear;
    });

    // Count the number of users registered per department
    const departmentCounts = {};
    monthlyRecords.forEach(user => {
        const department = user.department;
        if (!departmentCounts[department]) {
            departmentCounts[department] = 0;
        }
        departmentCounts[department]++;
    });

    // Prepare data for the chart
    const labels = Object.keys(departmentCounts).sort();
    const data = labels.map(department => departmentCounts[department]);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Users',
                data: data,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
}