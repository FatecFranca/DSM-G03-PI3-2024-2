document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const celular = document.getElementById('celular').value;
    const senha = document.getElementById('senha').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }

    const data = { nome, email, phone, password };

    try {
        const response = await fetch('http://localhost:8080/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Conta criada com sucesso!');
            window.location.href = 'login.html';
        } else {
            const errorData = await response.json();
            alert('Erro ao criar conta: ' + (errorData.message || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao conectar ao servidor.');
    }
});
