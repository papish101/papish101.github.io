const form = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const toggle = document.getElementById('toggle');
let isLogin = true;

// Toggle between login and registration
toggle.addEventListener('click', () => {
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? 'Login' : 'Register';
    form.querySelector('button').textContent = isLogin ? 'Login' : 'Register';
    toggle.textContent = isLogin ? "Don't have an account? Register here" : "Already have an account? Login here";
});

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert(isLogin ? 'Login successful!' : 'Registration successful!');
            if (isLogin) window.location.href = '/exam.html';
        } else {
            alert(data.message || 'Something went wrong');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the server');
    }
});
