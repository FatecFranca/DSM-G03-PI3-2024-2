// Estrutura de dados para armazenar as peças
let partsData = [
    {
        id: 1,
        name: 'Pastilha de Freio',
        category: 'freio',
        vehicle: 'Carro 1',
        quantity: 4,
        price: 89.90,
        status: 'novo',
        lastMaintenance: '2024-01-15',
        observations: 'Peça original'
    }
];

// Função para criar os cards de peças
function createPartCards(parts = partsData) {
    const grid = document.querySelector('.parts-grid');
    grid.innerHTML = '';

    parts.forEach(part => {
        const card = document.createElement('div');
        card.className = 'part-card';
        card.innerHTML = `
            <div class="part-header">
                <h3>${part.name}</h3>
                <span class="status-badge ${part.status}">${part.status}</span>
            </div>
            <div class="part-info">
                <p><i class="fas fa-car"></i> ${part.vehicle}</p>
                <p><i class="fas fa-tag"></i> ${part.category}</p>
                <p><i class="fas fa-cubes"></i> Quantidade: ${part.quantity}</p>
                <p><i class="fas fa-dollar-sign"></i> Preço: R$ ${part.price.toFixed(2)}</p>
                <p><i class="fas fa-calendar"></i> Última manutenção: ${part.lastMaintenance}</p>
                ${part.observations ? `<p><i class="fas fa-comment"></i> ${part.observations}</p>` : ''}
            </div>
            <div class="part-actions">
                <button onclick="showEditModal(${part.id})" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="confirmDelete(${part.id})" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Função para mostrar o modal de adição
function showAddModal() {
    const modal = document.getElementById('partModal');
    const form = document.getElementById('partForm');
    const title = modal.querySelector('h2');
    
    title.textContent = 'Adicionar Nova Peça';
    form.dataset.mode = 'add';
    form.reset();
    
    modal.style.display = 'block';
}

// Função para mostrar o modal de edição
function showEditModal(id) {
    const modal = document.getElementById('partModal');
    const form = document.getElementById('partForm');
    const title = modal.querySelector('h2');
    const part = partsData.find(p => p.id === id);
    
    if (!part) return;
    
    title.textContent = 'Editar Peça';
    form.dataset.mode = 'edit';
    form.dataset.editId = id;
    
    // Preencher o formulário com os dados da peça
    Object.keys(part).forEach(key => {
        const input = form.elements[key];
        if (input) input.value = part[key];
    });
    
    modal.style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('partModal');
    const form = document.getElementById('partForm');
    form.reset();
    modal.style.display = 'none';
}

// Função para gerar novo ID
function generateNewId() {
    return Math.max(...partsData.map(part => part.id), 0) + 1;
}

// Função para salvar ou atualizar uma peça
function savePart(formData) {
    const form = document.getElementById('partForm');
    const isEdit = form.dataset.mode === 'edit';
    
    const partData = {
        id: isEdit ? parseInt(form.dataset.editId) : generateNewId(),
        name: formData.get('name'),
        category: formData.get('category'),
        vehicle: formData.get('vehicle'),
        quantity: parseInt(formData.get('quantity')),
        price: parseFloat(formData.get('price')),
        status: formData.get('status') || 'novo',
        lastMaintenance: formData.get('lastMaintenance') || new Date().toISOString().split('T')[0],
        observations: formData.get('observations')
    };

    if (isEdit) {
        const index = partsData.findIndex(p => p.id === partData.id);
        if (index !== -1) {
            partsData[index] = partData;
        }
    } else {
        partsData.push(partData);
    }

    createPartCards();
    closeModal();
    showToast(isEdit ? 'Peça atualizada com sucesso!' : 'Peça adicionada com sucesso!');
}

// Função para confirmar e deletar uma peça
function confirmDelete(id) {
    if (confirm('Tem certeza que deseja excluir esta peça?')) {
        partsData = partsData.filter(part => part.id !== id);
        createPartCards();
        showToast('Peça excluída com sucesso!');
    }
}

// Função para mostrar mensagens de toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Função para filtrar peças
function filterParts() {
    const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
    const vehicleFilter = document.getElementById('vehicleFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredParts = partsData.filter(part => {
        const matchSearch = part.name.toLowerCase().includes(searchTerm) ||
                          part.category.toLowerCase().includes(searchTerm) ||
                          part.vehicle.toLowerCase().includes(searchTerm);
        
        const matchVehicle = !vehicleFilter || part.vehicle === vehicleFilter;
        const matchCategory = !categoryFilter || part.category === categoryFilter;
        const matchStatus = !statusFilter || part.status === statusFilter;

        return matchSearch && matchVehicle && matchCategory && matchStatus;
    });

    createPartCards(filteredParts);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar a exibição das peças
    createPartCards();
    
    // Listener para o formulário
    const form = document.getElementById('partForm');
    form?.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        savePart(formData);
    });
    
    // Listener para busca
    const searchInput = document.querySelector('.search-box input');
    searchInput?.addEventListener('input', filterParts);
    
    // Listeners para filtros
    const filters = document.querySelectorAll('select[id$="Filter"]');
    filters.forEach(filter => {
        filter.addEventListener('change', filterParts);
    });
    
    // Listener para fechar modal clicando fora
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('partModal');
        if (e.target === modal) {
            closeModal();
        }
    });
});