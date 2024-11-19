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

// Função para salvar ou atualizar um serviço/peça
let isSubmitting = false;

async function saveService(event) {
    event.preventDefault();

    if (isSubmitting) {
        console.log('Já está submetendo. Ignorando clique adicional.');
        return;
    }

    isSubmitting = true;

    const form = event.target;
    const formData = new FormData(form);
    const isEditing = form.dataset.mode === 'edit';

    const serviceData = {
        nome: formData.get('name'),
        categoria: formData.get('category'),
        preco: parseFloat(formData.get('price')),
        diasValidade: parseInt(formData.get('diasValidade')),
        kmValidade: parseInt(formData.get('kmValidade')),
        status: formData.get('status'),
        observacoes: formData.get('observations'),
        veiculo_id: formData.get('vehicle'),
        kmServ: parseInt(formData.get('kmServ')) || 0,
        data_serv: formData.get('dataServico'),
        oficina_id: '672d415f453530ff2c2e4a4a'
    };

    console.log('Dados a serem enviados:', serviceData);

    try {
        const url = isEditing 
            ? `http://localhost:8080/tipoServicos/${form.dataset.editId}`
            : 'http://localhost:8080/tipoServicos';

        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceData),
        });

        const result = await response.json();
        console.log('Resposta do servidor:', result);

        if (response.ok) {
            closeModal();
            await loadServices();
            showToast(isEditing ? 'Serviço/Peça atualizado com sucesso!' : 'Serviço/Peça adicionado com sucesso!');
        } else {
            throw new Error(result.error || 'Erro ao processar serviço/peça');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast(error.message);
    } finally {
        isSubmitting = false;
    }
}

function createServiceCards(services = servicesData) {
    const grid = document.querySelector('.parts-grid');
    grid.innerHTML = '';

    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'part-card';
        card.innerHTML = `
            <div class="part-header">
                <h3>${service.nome}</h3>
                <span class="category-badge">${service.categoria}</span>
            </div>
            <div class="part-info">
                <p><i class="fas fa-dollar-sign"></i> Preço: R$ ${service.preco.toFixed(2)}</p>
                <p><i class="fas fa-calendar"></i> Validade: ${service.diasValidade} dias</p>
                <p><i class="fas fa-road"></i> Validade KM: ${service.kmValidade} km</p>
                <p><i class="fas fa-info-circle"></i> Status: ${service.status}</p>
                ${service.observacoes ? `<p><i class="fas fa-comment"></i> ${service.observacoes}</p>` : ''}
                ${service.servicos && service.servicos.length > 0 ? `
                    <p><i class="fas fa-wrench"></i> Último serviço: ${new Date(service.servicos[0].data_serv).toLocaleDateString()} - ${service.servicos[0].kmServ || 'N/A'} km</p>
                ` : ''}
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
            form.elements['status'].value = service.status;
            
            // Se houver um serviço associado, preencha os campos relacionados
            if (service.servicos && service.servicos.length > 0) {
                const lastService = service.servicos[0];
                form.elements['kmServ'].value = lastService.kmServ;
                form.elements['dataServico'].value = new Date(lastService.data_serv).toISOString().split('T')[0];
                form.elements['vehicle'].value = lastService.veiculo_id;
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
async function filterServices() {
    const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
    const vehicleFilter = document.getElementById('vehicleFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;

    try {
        let url = 'http://localhost:8080/tipoServicos';
        
        if (searchTerm) {
            url = `http://localhost:8080/tipoServicos/search?query=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url);
        if (response.ok) {
            let services = await response.json();

            // Aplicar filtros adicionais no lado do cliente
            services = services.filter(service => {
                const matchCategory = !categoryFilter || service.categoria.toLowerCase() === categoryFilter.toLowerCase();
                const matchVehicle = !vehicleFilter || (service.servicos && service.servicos.some(s => s.veiculo_id === vehicleFilter));
                return matchCategory && matchVehicle;
            });

            createServiceCards(services);
        } else {
            console.error('Erro ao buscar serviços:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar a exibição dos serviços e peças
    loadVehicles();
    loadServices();
    
    // Listener para o formulário
    const form = document.getElementById('partForm');
    if (form) {
        form.addEventListener('submit', saveService);
    }
    
    // Listener para busca com debounce
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        const debouncedFilterServices = debounce(filterServices, 300);
        searchInput.addEventListener('input', debouncedFilterServices);
    }
    
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
