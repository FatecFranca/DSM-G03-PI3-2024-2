document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Construir a URL com os parâmetros de query
    const url = new URL('http://localhost:8080/usuarios/');
    url.searchParams.append('email', email);
    url.searchParams.append('senha', password);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            const userId = result.id;

            // Armazenar o ID do usuário no localStorage
            localStorage.setItem('userId', userId);

            alert('Login bem-sucedido!');
            window.location.href = 'dashboard.html'; // Redirecionar para a página principal
        } else {
            const errorData = await response.json();
            alert('Erro ao fazer login: ' + (errorData.message || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao conectar ao servidor.');
    }
});