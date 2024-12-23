function registerUser() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const now = new Date();
    const registrationDate = now.toLocaleDateString();
    const registrationTime = now.toLocaleTimeString();

    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Check if the username or email already exists
    const userExists = registeredUsers.some(user => user.username === username || user.email === email);
    if (userExists) {
        alert('Username or email already registered');
        return;
    }

    registeredUsers.push({ username, email, password, registrationDate, registrationTime });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('User registered successfully');
}