// Estrutura de dados para armazenar os serviços e peças
let servicesData = [];

// Função para carregar os veículos do usuário
async function loadVehicles() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('Usuário não está logado');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/veiculos?usuario_id=${userId}`);
        if (response.ok) {
            const vehicles = await response.json();
            const vehicleSelect = document.getElementById('vehicle');
            vehicleSelect.innerHTML = '<option value="">Selecione um veículo</option>';
            vehicles.forEach(vehicle => {
                vehicleSelect.innerHTML += `<option value="${vehicle.id}">${vehicle.marca} ${vehicle.modelo} (${vehicle.placa})</option>`;
            });
        } else {
            console.error('Erro ao carregar veículos:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

// Função para carregar os serviços e peças
async function loadServices() {
    try {
        const response = await fetch('http://localhost:8080/tipoServicos');
        if (response.ok) {
            servicesData = await response.json();
            createServiceCards(servicesData);
        } else {
            console.error('Erro ao carregar serviços:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

// Função para criar os cards de serviços e peças
function createServiceCards(services = servicesData) {
    const grid = document.querySelector('.parts-grid');
    grid.innerHTML = '';

    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'part-card';
        card.innerHTML = `
            <div class="part-header">
                <h3>${service.nome}</h3>
                <span class="category-badge">${service.categoria === 'servico' ? 'Serviço' : 'Peça'}</span>
            </div>
            <div class="part-info">
                <p><i class="fas fa-dollar-sign"></i> Preço: R$ ${service.preco.toFixed(2)}</p>
                <p><i class="fas fa-calendar"></i> Validade: ${service.diasValidade} dias</p>
                <p><i class="fas fa-road"></i> Validade KM: ${service.kmValidade} km</p>
                ${service.observacoes ? `<p><i class="fas fa-comment"></i> ${service.observacoes}</p>` : ''}
            </div>
            <div class="part-actions">
                <button onclick="showEditModal('${service.id}')" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="confirmDelete('${service.id}')" class="delete-btn">
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
    
    title.textContent = 'Adicionar Novo Serviço/Peça';
    form.dataset.mode = 'add';
    form.reset();
    
    modal.style.display = 'block';
}

// Função para mostrar o modal de edição
async function showEditModal(id) {
    const modal = document.getElementById('partModal');
    const form = document.getElementById('partForm');
    const title = modal.querySelector('h2');
    
    title.textContent = 'Editar Serviço/Peça';
    form.dataset.mode = 'edit';
    form.dataset.editId = id;
    
    try {
        const response = await fetch(`http://localhost:8080/tipoServicos/${id}`);
        if (response.ok) {
            const service = await response.json();
            
            // Preencher o formulário com os dados do serviço
            form.elements['name'].value = service.nome;
            form.elements['category'].value = service.categoria;
            form.elements['price'].value = service.preco;
            form.elements['diasValidade'].value = service.diasValidade;
            form.elements['kmValidade'].value = service.kmValidade;
            form.elements['observations'].value = service.observacoes || '';
            
            // Se houver um veículo associado, selecione-o
            if (service.servicos && service.servicos.length > 0) {
                form.elements['vehicle'].value = service.servicos[0].veiculo_id;
            }
            
            modal.style.display = 'block';
        } else {
            console.error('Erro ao carregar dados do serviço');
        }
    } catch (error) {
        console.error('Erro ao buscar dados do serviço:', error);
    }
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('partModal');
    const form = document.getElementById('partForm');
    form.reset();
    modal.style.display = 'none';
}

// Função para salvar ou atualizar um serviço/peça
async function saveService(formData) {
    const form = document.getElementById('partForm');
    const isEdit = form.dataset.mode === 'edit';
    const serviceId = isEdit ? form.dataset.editId : null;
    
    const serviceData = {
        nome: formData.get('name'),
        categoria: formData.get('category'),
        preco: parseFloat(formData.get('price')),
        diasValidade: parseInt(formData.get('diasValidade')),
        kmValidade: parseInt(formData.get('kmValidade')),
        observacoes: formData.get('observations'),
        oficina_id: "64e90af32be3e7ea9a68c3cb", // Substitua pelo ID real da oficina
        veiculo_id: formData.get('vehicle')
    };

    try {
        const url = isEdit 
            ? `http://localhost:8080/tipoServicos/${serviceId}`
            : 'http://localhost:8080/tipoServicos';
        
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceData),
        });

        if (response.ok) {
            closeModal();
            loadServices();
            showToast(isEdit ? 'Serviço atualizado com sucesso!' : 'Serviço adicionado com sucesso!');
        } else {
            throw new Error(isEdit ? 'Erro ao atualizar serviço' : 'Erro ao adicionar serviço');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast(error.message);
    }
}

// Função para confirmar e deletar um serviço/peça
async function confirmDelete(id) {
    if (confirm('Tem certeza que deseja excluir este serviço/peça?')) {
        try {
            const response = await fetch(`http://localhost:8080/tipoServicos/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadServices();
                showToast('Serviço/peça excluído com sucesso!');
            } else {
                throw new Error('Erro ao excluir serviço/peça');
            }
        } catch (error) {
            console.error('Erro ao excluir serviço/peça:', error);
            showToast('Erro ao excluir serviço/peça');
        }
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

// Função para filtrar serviços e peças
function filterServices() {
    const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
    const vehicleFilter = document.getElementById('vehicleFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;

    const filteredServices = servicesData.filter(service => {
        const matchSearch = service.nome.toLowerCase().includes(searchTerm);
        const matchCategory = !categoryFilter || service.categoria === categoryFilter;
        const matchVehicle = !vehicleFilter || (service.servicos && service.servicos.some(s => s.veiculo_id === vehicleFilter));

        return matchSearch && matchCategory && matchVehicle;
    });

    createServiceCards(filteredServices);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar a exibição dos serviços e peças
    loadVehicles();
    loadServices();
    
    // Listener para o formulário
    const form = document.getElementById('partForm');
    form?.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        saveService(formData);
    });
    
    // Listener para busca
    const searchInput = document.querySelector('.search-box input');
    searchInput?.addEventListener('input', filterServices);
    
    // Listeners para filtros
    const filters = document.querySelectorAll('select[id$="Filter"]');
    filters.forEach(filter => {
        filter.addEventListener('change', filterServices);
    });
    
    // Listener para fechar modal clicando fora
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('partModal');
        if (e.target === modal) {
            closeModal();
        }
    });
});