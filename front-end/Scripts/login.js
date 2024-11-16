document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    // Reset error messages
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    
    let isValid = true;

    // Validate email
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        emailError.textContent = 'Por favor, insira um e-mail válido';
        emailError.style.display = 'block';
        isValid = false;
    }

    // Validate password
    if (password.length < 6) {
        passwordError.textContent = 'A senha deve ter pelo menos 6 caracteres';
        passwordError.style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        // Aqui você pode adicionar a lógica de autenticação
        alert('Login realizado com sucesso!');
        // Exemplo de redirecionamento:
        // window.location.href = 'dashboard.html';
    }
});