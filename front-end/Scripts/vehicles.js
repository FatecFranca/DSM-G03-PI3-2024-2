// Simulação de banco de dados
let vehicles = [
    {
        id: 1,
        brand: 'volkswagen',
        model: 'Golf',
        year: 2023,
        plate: 'ABC1D23',
        color: 'Preto',
        km: 15000,
        status: 'ativo',
        notes: 'Revisão em dia'
    }
];

// Funções de utilidade
function generateId() {
    return Math.max(...vehicles.map(v => v.id), 0) + 1;
}

// Funções do Modal
function showAddVehicleModal() {
    document.getElementById('modalTitle').textContent = 'Adicionar Novo Veículo';
    document.getElementById('vehicleId').value = '';
    document.getElementById('vehicleForm').reset();
    document.getElementById('vehicleModal').style.display = 'block';
}

function showEditVehicleModal(vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    document.getElementById('modalTitle').textContent = 'Editar Veículo';
    document.getElementById('vehicleId').value = vehicle.id;
    document.getElementById('vehicleBrand').value = vehicle.brand;
    document.getElementById('vehicleModel').value = vehicle.model;
    document.getElementById('vehicleYear').value = vehicle.year;
    document.getElementById('vehiclePlate').value = vehicle.plate;
    document.getElementById('vehicleColor').value = vehicle.color;
    document.getElementById('vehicleKm').value = vehicle.km;
    document.getElementById('vehicleStatus').value = vehicle.status;
    document.getElementById('vehicleNotes').value = vehicle.notes;

    document.getElementById('vehicleModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('vehicleModal').style.display = 'none';
}

// Funções de manipulação de veículos
function addVehicle(vehicleData) {
    const newVehicle = {
        id: generateId(),
        ...vehicleData
    };
    vehicles.push(newVehicle);
    renderVehicles();
}

function updateVehicle(id, vehicleData) {
    const index = vehicles.findIndex(v => v.id === Number(id));
    if (index !== -1) {
        vehicles[index] = { ...vehicles[index], ...vehicleData };
        renderVehicles();
    }
}

function deleteVehicle(id) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
        vehicles = vehicles.filter(v => v.id !== id);
        renderVehicles();
    }
}

// Funções de renderização
function createVehicleCard(vehicle) {
    return `
        <div class="vehicle-card">
            <div class="vehicle-header">
                <h3 class="vehicle-title">${vehicle.brand.charAt(0).toUpperCase() + vehicle.brand.slice(1)} ${vehicle.model}</h3>
                <span class="vehicle-status status-${vehicle.status}">
                    ${vehicle.status === 'ativo' ? 'Ativo' : 
                      vehicle.status === 'manutencao' ? 'Em Manutenção' : 'Inativo'}
                </span>
            </div>
            <div class="vehicle-info">
                <div class="info-item">
                    <span class="info-label">Placa</span>
                    <span class="info-value">${vehicle.plate}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Ano</span>
                    <span class="info-value">${vehicle.year}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Cor</span>
                    <span class="info-value">${vehicle.color}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Quilometragem</span>
                    <span class="info-value">${vehicle.km.toLocaleString()} km</span>
                </div>
            </div>
            <div class="vehicle-actions">
                <button class="action-btn edit-btn" onclick="showEditVehicleModal(${vehicle.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="action-btn delete-btn" onclick="deleteVehicle(${vehicle.id})">
                    <i class="fas fa-trash-alt"></i> Excluir
                </button>
            </div>
        </div>
    `;
}

function renderVehicles() {
    const grid = document.getElementById('vehiclesGrid');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const brandFilter = document.getElementById('brandFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    let filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch = (
            vehicle.model.toLowerCase().includes(searchTerm) ||
            vehicle.plate.toLowerCase().includes(searchTerm) ||
            vehicle.brand.toLowerCase().includes(searchTerm)
        );
        const matchesBrand = !brandFilter || vehicle.brand === brandFilter;
        const matchesYear = !yearFilter || vehicle.year.toString() === yearFilter;
        const matchesStatus = !statusFilter || vehicle.status === statusFilter;

        return matchesSearch && matchesBrand && matchesYear && matchesStatus;
    });

    grid.innerHTML = filteredVehicles.map(createVehicleCard).join('');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar a grid
    renderVehicles();

    // Form submission
    document.getElementById('vehicleForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const vehicleData = {
            brand: document.getElementById('vehicleBrand').value,
            model: document.getElementById('vehicleModel').value,
            year: Number(document.getElementById('vehicleYear').value),
            plate: document.getElementById('vehiclePlate').value.toUpperCase(),
            color: document.getElementById('vehicleColor').value,
            km: Number(document.getElementById('vehicleKm').value),
            status: document.getElementById('vehicleStatus').value,
            notes: document.getElementById('vehicleNotes').value
        };

        const vehicleId = document.getElementById('vehicleId').value;

        if (vehicleId) {
            updateVehicle(Number(vehicleId), vehicleData);
        } else {
            addVehicle(vehicleData);
        }

        closeModal();
    });

    // Filtros
    document.getElementById('searchInput').addEventListener('input', renderVehicles);
    document.getElementById('brandFilter').addEventListener('change', renderVehicles);
    document.getElementById('yearFilter').addEventListener('change', renderVehicles);
    document.getElementById('statusFilter').addEventListener('change', renderVehicles);

    // Fechar modal quando clicar fora
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('vehicleModal');
        if (e.target === modal) {
            closeModal();
        }
    });
});