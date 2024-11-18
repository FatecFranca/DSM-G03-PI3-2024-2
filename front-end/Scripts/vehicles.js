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

    const vehicleId = document.getElementById('vehicleId').value;
    const brand = document.getElementById('vehicleBrand').value;
    const model = document.getElementById('vehicleModel').value;
    const year = document.getElementById('vehicleYear').value;
    const plate = document.getElementById('vehiclePlate').value;
    const color = document.getElementById('vehicleColor').value;
    const km = document.getElementById('vehicleKm').value;
    const renavam = document.getElementById('vehicleRenavam').value;
    const status = document.getElementById('vehicleStatus').value;
    const notes = document.getElementById('vehicleNotes').value;

    const userId = localStorage.getItem('userId');

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
        const url = vehicleId 
            ? `http://localhost:8080/veiculos/${vehicleId}`
            : 'http://localhost:8080/veiculos';
        
        const method = vehicleId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert(vehicleId ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
            closeModal();
            loadVehicles(); // Recarrega a lista de veículos
        } else {
            const errorData = await response.json();
            alert('Erro ao ' + (vehicleId ? 'atualizar' : 'cadastrar') + ' veículo: ' + (errorData.message || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao conectar ao servidor.');
    }
});

// Função para carregar a lista de veículos
async function loadVehicles() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('Usuário não está logado');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/veiculos?usuario_id=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const vehicles = await response.json();
            displayVehicles(vehicles);
        } else {
            console.error('Erro ao carregar veículos:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

// Função para exibir a lista de veículos na interface do usuário
function displayVehicles(vehicles) {
    const vehiclesGrid = document.getElementById('vehiclesGrid');
    const errorMessage = document.getElementById('errorMessage');
    vehiclesGrid.innerHTML = '';
    errorMessage.textContent = '';

    if (vehicles.length === 0) {
        errorMessage.textContent = 'Nenhum veículo encontrado.';
        return;
    }

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
            <div class="vehicle-actions">
                <button onclick="editVehicle('${vehicle.id}')" class="edit-btn">Editar</button>
                <button onclick="deleteVehicle('${vehicle.id}')" class="delete-btn">Excluir</button>
            </div>
        `;

        vehiclesGrid.appendChild(vehicleCard);
    });
}

function editVehicle(vehicleId) {
    // Buscar os dados do veículo
    fetch(`http://localhost:8080/veiculos/${vehicleId}`)
        .then(response => response.json())
        .then(vehicle => {
            // Preencher o formulário com os dados do veículo
            document.getElementById('vehicleId').value = vehicle.id;
            document.getElementById('vehicleBrand').value = vehicle.marca;
            document.getElementById('vehicleModel').value = vehicle.modelo;
            document.getElementById('vehicleYear').value = vehicle.ano_modelo;
            document.getElementById('vehiclePlate').value = vehicle.placa;
            document.getElementById('vehicleColor').value = vehicle.cor;
            document.getElementById('vehicleKm').value = vehicle.quilometragem;
            document.getElementById('vehicleRenavam').value = vehicle.renavan;
            document.getElementById('vehicleStatus').value = vehicle.status;
            document.getElementById('vehicleNotes').value = vehicle.observacoes;

            // Alterar o título do modal
            document.getElementById('modalTitle').textContent = 'Editar Veículo';

            // Exibir o modal
            showAddVehicleModal();
        })
        .catch(error => console.error('Erro ao buscar dados do veículo:', error));
}

function deleteVehicle(vehicleId) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
        fetch(`http://localhost:8080/veiculos/${vehicleId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Veículo excluído com sucesso!');
                loadVehicles(); // Recarregar a lista de veículos
            } else {
                alert('Erro ao excluir veículo');
            }
        })
        .catch(error => console.error('Erro ao excluir veículo:', error));
    }
}

// Carrega a lista de veículos ao carregar a página
window.onload = loadVehicles;
