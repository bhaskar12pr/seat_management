document.addEventListener('DOMContentLoaded', () => {
    displayUsers();
});

function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const department = document.getElementById('register-department').value;

    const newUser = {
        username: username,
        email: email,
        password: password,
        department: department,
        role: 'User' // Default role
    };

    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('User registered successfully!');
    document.getElementById('register-form').reset();
}

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
    displayUsers();
}