import prisma from '../database/client.js'

const OFICINA_ID = "672d415f453530ff2c2e4a4a"; // ID da oficina pré-cadastrada

const controller = {}

controller.create = async function(req, res) {
  try {
    const { veiculo_id, ...tipoServicoData } = req.body;
    
    const createdTipoServico = await prisma.tipoServico.create({
      data: {
        ...tipoServicoData,
        oficina_id: OFICINA_ID, // Sempre usa a oficina pré-cadastrada
        servicos: {
          create: {
            veiculo: { connect: { id: veiculo_id } },
            num_serv: 1, // Você pode querer gerar este número de forma mais sofisticada
            data_serv: new Date()
          }
        }
      },
      include: {
        servicos: {
          include: {
            veiculo: true
          }
        },
        oficina: true
      }
    });

    res.status(201).json(createdTipoServico);
  }
  catch(error) {
    console.error('Erro ao criar tipo de serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao criar tipo de serviço' });
  }
}

controller.retrieveAll = async function(req, res) {
  try {
    const result = await prisma.tipoServico.findMany({
      where: { oficina_id: OFICINA_ID },
      include: {
        servicos: {
          include: {
            veiculo: true
          }
        },
        oficina: true
      },
      orderBy: { nome: 'asc' }
    });

    res.json(result);
  }
  catch(error) {
    console.error('Erro ao recuperar todos os tipos de serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao recuperar tipos de serviço' });
  }
}

controller.retrieveOne = async function(req, res) {
  try {
    const result = await prisma.tipoServico.findUnique({
      where: { 
        id: req.params.id,
        oficina_id: OFICINA_ID
      },
      include: {
        servicos: {
          include: {
            veiculo: true
          }
        },
        oficina: true
      }
    });

    if(result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Tipo de serviço não encontrado' });
    }
  }
  catch(error) {
    console.error('Erro ao recuperar tipo de serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao recuperar tipo de serviço' });
  }
}

controller.update = async function(req, res) {
  try {
    const { veiculo_id, ...tipoServicoData } = req.body;

    const updatedTipoServico = await prisma.tipoServico.update({
      where: { 
        id: req.params.id,
        oficina_id: OFICINA_ID
      },
      data: {
        ...tipoServicoData,
        servicos: {
          updateMany: {
            where: { tipoServico_id: req.params.id },
            data: { veiculo_id: veiculo_id }
          }
        }
      },
      include: {
        servicos: {
          include: {
            veiculo: true
          }
        },
        oficina: true
      }
    });

    if(updatedTipoServico) {
      res.json(updatedTipoServico);
    } else {
      res.status(404).json({ error: 'Tipo de serviço não encontrado' });
    }
  }
  catch(error) {
    console.error('Erro ao atualizar tipo de serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao atualizar tipo de serviço' });
  }
}

controller.delete = async function(req, res) {
  try {
    await prisma.tipoServico.delete({
      where: { 
        id: req.params.id,
        oficina_id: OFICINA_ID
      }
    });

    res.status(204).end();
  }
  catch(error) {
    if(error?.code === 'P2025') {
      res.status(404).json({ error: 'Tipo de serviço não encontrado' });
    }
    else {
      console.error('Erro ao excluir tipo de serviço:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao excluir tipo de serviço' });
    }
  }
}

export default controller