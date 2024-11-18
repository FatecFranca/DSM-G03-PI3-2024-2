document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const birthdate = document.getElementById('birthdate').value;
    const logradouro = document.getElementById('logradouro').value;
    const num_casa = document.getElementById('num_casa').value;
    const complemento = document.getElementById('complemento').value;
    const bairro = document.getElementById('bairro').value;
    const municipio = document.getElementById('municipio').value;
    const uf = document.getElementById('uf').value;
    const cep = document.getElementById('cep').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }
    
// Converter a data de nascimento para o formato ISO 8601
const birthdateISO = new Date(birthdate).toISOString();

const data = {
    nome: name,
    cpf: cpf,
    email: email,
    celular: phone,
    data_nascimento: birthdateISO, 
    logradouro: logradouro,
    num_casa: num_casa,
    complemento: complemento,
    bairro: bairro,
    municipio: municipio,
    uf: uf,
    cep: cep,
    senha: password
};

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