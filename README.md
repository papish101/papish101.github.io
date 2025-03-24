<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CBT Exam - Login & Register</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; text-align: center; }
        #container { max-width: 400px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; }
        input, button { width: 100%; padding: 10px; margin: 10px 0; }
        #toggle { color: blue; cursor: pointer; text-decoration: underline; }
    </style>
</head>
<body>
    <div id="container">
        <h2 id="form-title">Login</h2>
        <form id="auth-form">
            <input type="text" id="username" placeholder="Username" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <p id="toggle">Don't have an account? Register here</p>
    </div>
    <p><a href="login.html"></a></p>

    <script>
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
                const response = await fetch(`http://localhost:5000${endpoint}`, {
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
    </script>
</body>
</html>
[![Netlify Status](https://api.netlify.com/api/v1/badges/e8398b70-3af3-4ee8-a49c-81c4964e577c/deploy-status)](https://app.netlify.com/sites/visionary-dango-f5c570/deploys)

