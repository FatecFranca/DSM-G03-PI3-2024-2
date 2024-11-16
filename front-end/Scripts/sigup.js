document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const phoneInput = document.getElementById('phone');

    // Máscara para o telefone
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 6) {
            value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0,2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }
        
        e.target.value = value;
    });

    // Submissão do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar senha
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return;
        }

        // Coletar dados do formulário
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: phoneInput.value,
            password: password
        };

        try {
            // Fazer requisição para API
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Erro no registro');
            }

            const data = await response.json();
            
            // Se registro for bem sucedido
            alert('Registro realizado com sucesso!');
            window.location.href = '/login.html';
            
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao realizar o registro. Por favor, tente novamente.');
        }
    });

    // Validação em tempo real da força da senha
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function(e) {
        const password = e.target.value;
        const hasNumber = /\d/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        // Você pode adicionar uma barra de progresso ou mensagem indicando a força da senha
        let strength = 0;
        if (hasNumber) strength++;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasSpecialChar) strength++;
        if (password.length >= 8) strength++;

        // Adicione sua própria lógica de feedback visual aqui
    });
});