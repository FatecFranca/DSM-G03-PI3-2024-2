// Função para exibir o modal de adicionar veículo
function showAddVehicleModal() {
    document.getElementById('vehicleModal').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('vehicleModal').style.display = 'none';
    document.getElementById('vehicleForm').reset();
}

// Função para enviar o formulário de cadastro de veículo
document.getElementById('vehicleForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const brand = document.getElementById('vehicleBrand').value;
    const model = document.getElementById('vehicleModel').value;
    const year = document.getElementById('vehicleYear').value;
    const plate = document.getElementById('vehiclePlate').value;
    const color = document.getElementById('vehicleColor').value;
    const km = document.getElementById('vehicleKm').value;
    const renavam = document.getElementById('vehicleRenavam').value;
    const status = document.getElementById('vehicleStatus').value;
    const notes = document.getElementById('vehicleNotes').value;

    const userId = localStorage.getItem('userId'); // Obtém o ID do usuário logado

    if (!userId) {
        alert('Erro: usuário não está logado.');
        return;
    }
    
    const data = {
        marca: brand,
        modelo: model,
        ano_modelo: parseInt(year),
        placa: plate,
        cor: color,
        quilometragem: parseInt(km),
        renavan: parseInt(renavam),
        status: status,
        observacoes: notes,
        usuario_id: userId
    };

    try {
        const response = await fetch('http://localhost:8080/veiculos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Veículo cadastrado com sucesso!');
            closeModal();
            loadVehicles(); // Recarrega a lista de veículos
        } else {
            const errorData = await response.json();
            alert('Erro ao cadastrar veículo: ' + (errorData.message || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao conectar ao servidor.');
    }
});

// Função para carregar a lista de veículos
async function loadVehicles() {
    try {
        const response = await fetch('http://localhost:8080/veiculos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const vehicles = await response.json();
            displayVehicles(vehicles);
        } else {
            console.error('Erro ao carregar veículos');
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

// Função para exibir a lista de veículos na interface do usuário
function displayVehicles(vehicles) {
    const vehiclesGrid = document.getElementById('vehiclesGrid');
    vehiclesGrid.innerHTML = '';

    vehicles.forEach(vehicle => {
        const vehicleCard = document.createElement('div');
        vehicleCard.classList.add('vehicle-card');

        vehicleCard.innerHTML = `
            <h3>${vehicle.marca} ${vehicle.modelo}</h3>
            <p><strong>Ano:</strong> ${vehicle.ano_modelo}</p>
            <p><strong>Placa:</strong> ${vehicle.placa}</p>
            <p><strong>Cor:</strong> ${vehicle.cor}</p>
            <p><strong>Quilometragem:</strong> ${vehicle.quilometragem} km</p>
            <p><strong>Renavam:</strong> ${vehicle.renavan}</p>
            <p><strong>Status:</strong> ${vehicle.status}</p>
            <p><strong>Observações:</strong> ${vehicle.observacoes || 'Nenhuma'}</p>
        `;

        vehiclesGrid.appendChild(vehicleCard);
    });
}

// Carrega a lista de veículos ao carregar a página
window.onload = loadVehicles;
