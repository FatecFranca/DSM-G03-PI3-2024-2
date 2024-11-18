document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Tentando login com:', { email, password: '********' });

    const url = new URL('http://localhost:8080/usuarios/login');
    url.searchParams.append('email', email);
    url.searchParams.append('senha', password);

    try {
        console.log('Enviando requisição para:', url.toString());
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Status da resposta:', response.status);
        const responseData = await response.text();
        console.log('Resposta do servidor:', responseData);

        let result;
        try {
            result = JSON.parse(responseData);
        } catch (e) {
            console.error('Erro ao fazer parse da resposta JSON:', e);
        }

        if (response.ok) {
            if (result && result.id) {
                localStorage.setItem('userId', result.id);
                alert('Login bem-sucedido!');
                window.location.href = 'historico.html';
            } else {
                alert('Erro: ID do usuário não encontrado na resposta do servidor.');
            }
        } else {
            alert('Erro ao fazer login: ' + (result?.message || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao conectar ao servidor.');
    }
});
