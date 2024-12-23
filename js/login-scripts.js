function loginUser(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Retrieve the registered users data from localStorage
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Check if the username and password match any registered user
    const user = registeredUsers.find(user => user.username === username && user.password === password);
    if (user) {
        sessionStorage.setItem('username', username);
        alert('Login successful');
        // Redirect to attendance page or perform other actions
        window.location.href = 'attendance.html'; // Redirect to attendance page
    } else {
        alert('Invalid username or password');
    }
}