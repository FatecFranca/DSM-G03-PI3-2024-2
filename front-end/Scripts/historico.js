// historico.js

// Função para carregar o histórico de manutenções
async function loadMaintenanceHistory() {
    console.log('Carregando histórico de manutenções...');
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('Usuário não está logado');
            return;
        }

        console.log('UserId:', userId);

        const response = await fetch(`http://localhost:8080/tipoServicos/historico?usuario_id=${userId}`);
        if (response.ok) {
            const maintenanceHistory = await response.json();
            console.log('Histórico recebido:', maintenanceHistory);
            displayMaintenanceHistory(maintenanceHistory);
            updateTotalMaintenance(maintenanceHistory.length);
        } else {
            console.error('Erro ao carregar histórico:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

// Função para exibir o histórico de manutenções
function displayMaintenanceHistory(maintenanceHistory) {
    const grid = document.querySelector('.maintenance-grid');
    const message = document.getElementById('message');
    
    if (maintenanceHistory.length === 0) {
        message.textContent = 'Nenhuma manutenção encontrada.';
        grid.innerHTML = '';
        return;
    }

    message.textContent = '';
    grid.innerHTML = '';

    maintenanceHistory.forEach(maintenance => {
        if (maintenance.servicos && maintenance.servicos.length > 0) {
            const card = createMaintenanceCard(maintenance);
            grid.appendChild(card);
        }
    });
}

// Função para criar um card de manutenção
function createMaintenanceCard(maintenance) {
    const serviceDate = new Date(maintenance.servicos[0].data_serv);
    const card = document.createElement('div');
    card.className = 'maintenance-card';
    card.innerHTML = `
        <h3>
            <i class="fas fa-cog"></i>
            ${maintenance.nome}
        </h3>
        <div class="maintenance-info">
            <p><i class="fas fa-calendar"></i> Data: ${serviceDate.toLocaleDateString()}</p>
            <p><i class="fas fa-tools"></i> Peça: ${maintenance.nome}</p>
            <p><i class="fas fa-dollar-sign"></i> Custo: R$ ${maintenance.preco.toFixed(2)}</p>
            <p><i class="fas fa-clock"></i> Próxima troca: ${calculateNextMaintenance(maintenance)}</p>
        </div>
        <span class="status-badge ${getStatusClass(maintenance)}">${getStatusText(maintenance)}</span>
        <button class="details-btn" onclick="showMaintenanceDetails('${maintenance.id}')">Ver Detalhes</button>
    `;
    return card;
}

// Função para calcular a próxima manutenção
function calculateNextMaintenance(maintenance) {
    const lastServiceDate = new Date(maintenance.servicos[0].data_serv);
    const nextDate = new Date(lastServiceDate.setDate(lastServiceDate.getDate() + maintenance.diasValidade));
    return nextDate.toLocaleDateString();
}

// Função para obter a classe de status
function getStatusClass(maintenance) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas as datas

    const serviceDate = new Date(maintenance.servicos[0].data_serv);
    serviceDate.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas as datas

    if (serviceDate < today) {
        return 'status-completed';
    } else if (serviceDate.getTime() === today.getTime()) {
        return 'status-in-progress';
    } else {
        return 'status-scheduled';
    }
}

// Função para obter o texto de status
function getStatusText(maintenance) {
    const statusClass = getStatusClass(maintenance);
    switch (statusClass) {
        case 'status-completed':
            return 'Concluída';
        case 'status-in-progress':
            return 'Em manutenção';
        case 'status-scheduled':
            return 'Agendada';
        default:
            return 'Desconhecido';
    }
}

// Função para atualizar o total de manutenções
function updateTotalMaintenance(total) {
    const totalBadge = document.querySelector('.status-badge');
    totalBadge.textContent = `Total de Manutenções: ${total}`;
}

// Função para mostrar detalhes da manutenção (você pode implementar um modal ou redirecionamento)
async function showMaintenanceDetails(maintenanceId) {
    try {
        const response = await fetch(`http://localhost:8080/tipoServicos/${maintenanceId}`);
        if (response.ok) {
            const maintenance = await response.json();
            displayMaintenanceDetails(maintenance);
        } else {
            console.error('Erro ao carregar detalhes da manutenção:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

function displayMaintenanceDetails(maintenance) {
    const modal = document.getElementById('detailsModal');
    const modalContent = document.getElementById('modalContent');

    const servico = maintenance.servicos[0]; // Assume que sempre há pelo menos um serviço
    const veiculo = servico.veiculo;

    modalContent.innerHTML = `
        <h3>Informações do Serviço</h3>
        <p><strong>Nome:</strong> ${maintenance.nome}</p>
        <p><strong>Categoria:</strong> ${maintenance.categoria}</p>
        <p><strong>Preço:</strong> R$ ${maintenance.preco.toFixed(2)}</p>
        <p><strong>Data do Serviço:</strong> ${new Date(servico.data_serv).toLocaleDateString()}</p>
        <p><strong>Quilometragem no Serviço:</strong> ${servico.kmServ} km</p>
        <p><strong>Validade em Dias:</strong> ${maintenance.diasValidade} dias</p>
        <p><strong>Validade em Quilometragem:</strong> ${maintenance.kmValidade} km</p>
        <p><strong>Status:</strong> ${getStatusText(maintenance)}</p>

        <h3>Informações do Veículo</h3>
        <p><strong>Nome:</strong> ${veiculo.marca} ${veiculo.modelo}</p>
        <p><strong>Renavan:</strong> ${veiculo.renavan}</p>
        <p><strong>Quilometragem Atual:</strong> ${veiculo.quilometragem} km</p>
        <p><strong>Status:</strong> ${veiculo.status}</p>
    `;

    modal.style.display = 'block';

    // Fechar o modal quando clicar no X
    const span = document.getElementsByClassName('close')[0];
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Fechar o modal quando clicar fora dele
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Função para filtrar manutenções
function filterMaintenance() {
    const searchTerm = document.querySelector('.filter-input[type="text"]').value.toLowerCase();
    const statusFilter = document.querySelector('.filter-select').value.toLowerCase();
    const dateFilter = document.querySelector('.filter-input[type="date"]').value;

    const cards = document.querySelectorAll('.maintenance-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const status = card.querySelector('.status-badge').textContent.toLowerCase();
        const date = card.querySelector('.maintenance-info p:first-child').textContent.split(': ')[1];

        const matchesSearch = title.includes(searchTerm);
        const matchesStatus = statusFilter === '' || status === statusFilter;
        const matchesDate = dateFilter === '' || date === dateFilter;

        card.style.display = matchesSearch && matchesStatus && matchesDate ? 'flex' : 'none';
    });

    updateTotalVisibleMaintenance();
}

function updateTotalVisibleMaintenance() {
    const visibleCards = document.querySelectorAll('.maintenance-card[style="display: flex;"]');
    const totalBadge = document.querySelector('.status-badge');
    totalBadge.textContent = `Total de Manutenções: ${visibleCards.length}`;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadMaintenanceHistory();

    // Adicionar event listeners para os filtros
    const searchInput = document.querySelector('.filter-input[type="text"]');
    const statusSelect = document.querySelector('.filter-select');
    const dateInput = document.querySelector('.filter-input[type="date"]');
    searchInput.addEventListener('input', filterMaintenance);
    statusSelect.addEventListener('change', filterMaintenance);
    dateInput.addEventListener('input', filterMaintenance);
    document.querySelectorAll('.filter-input').forEach(input => {
        input.addEventListener('input', filterMaintenance);
    });
});
