import prisma from '../database/client.js'

const OFICINA_ID = "672d415f453530ff2c2e4a4a"; 

const controller = {}

controller.create = async function(req, res) {
  const { veiculo_id, kmServ, data_serv, nome, ...tipoServicoData } = req.body;

  console.log('Iniciando criação de serviço');
  console.log('Dados recebidos:', { veiculo_id, kmServ, data_serv, nome, ...tipoServicoData });

  try {
    const result = await prisma.$transaction(async (prisma) => {
      console.log('Iniciando transação');

      // 1. Buscar TipoServico existente
      let tipoServico = await prisma.tipoServico.findFirst({
        where: {
          nome: nome,
          oficina_id: OFICINA_ID
        }
      });

      console.log('TipoServico existente:', tipoServico);

      // 2. Criar TipoServico se não existir
      if (!tipoServico) {
        console.log('Criando novo TipoServico');
        tipoServico = await prisma.tipoServico.create({
          data: {
            nome,
            ...tipoServicoData,
            oficina_id: OFICINA_ID
          }
        });
        console.log('Novo TipoServico criado:', tipoServico);
      }

      // 3. Verificar se já existe um Servico para este TipoServico e veículo
      const servicoExistente = await prisma.servico.findFirst({
        where: {
          tipoServico_id: tipoServico.id,
          veiculo_id: veiculo_id,
          data_serv: new Date(data_serv)
        }
      });

      if (servicoExistente) {
        console.log('Serviço já existe:', servicoExistente);
        return { tipoServico, servico: servicoExistente };
      }

      // 4. Criar novo Servico
      console.log('Criando novo Servico');
      const novoServico = await prisma.servico.create({
        data: {
          veiculo: { connect: { id: veiculo_id } },
          tipo_servico: { connect: { id: tipoServico.id } },
          num_serv: await getNextNumServ(prisma, veiculo_id),
          kmServ: parseInt(kmServ) || 0,
          data_serv: new Date(data_serv)
        },
        include: {
          veiculo: true,
          tipo_servico: true
        }
      });

      console.log('Novo Servico criado:', novoServico);

      return { tipoServico, servico: novoServico };
    });

    console.log('Transação concluída com sucesso');
    console.log('Resultado final:', result);
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro detalhado ao criar tipo de serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao criar tipo de serviço' });
  }
}

controller.getHistorico = async function(req, res) {
  const userId = req.query.usuario_id;

  try {
      const result = await prisma.tipoServico.findMany({
          where: {
              oficina_id: OFICINA_ID,
              servicos: {
                  some: {
                      veiculo: {
                          usuario_id: userId
                      }
                  }
              }
          },
          include: {
              servicos: {
                  include: {
                      veiculo: true
                  },
                  orderBy: {
                      data_serv: 'desc'
                  },
                  take: 1
              }
          },
          orderBy: {
              servicos: {
                  _count: 'desc'
              }
          }
      });

      res.json(result);
  } catch (error) {
      console.error('Erro ao buscar histórico de manutenções:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar histórico de manutenções' });
  }
};

controller.search = async function(req, res) {
  try {
    const { query } = req.query; // Obtém o termo de busca da query string

    const result = await prisma.tipoServico.findMany({
      where: {
        oficina_id: OFICINA_ID,
        OR: [
          { nome: { contains: query, mode: 'insensitive' } },
          { categoria: { contains: query, mode: 'insensitive' } },
          { observacoes: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        servicos: {
          include: {
            veiculo: true
          },
          orderBy: {
            data_serv: 'desc'
          },
          take: 1 // Pega apenas o serviço mais recente
        },
        oficina: true
      },
      orderBy: { nome: 'asc' }
    });

    res.json(result);
  } catch(error) {
    console.error('Erro ao buscar tipos de serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar tipos de serviço' });
  }
};

// Função auxiliar para obter o próximo número de serviço
async function getNextNumServ(prisma, veiculo_id) {
  const lastService = await prisma.servico.findFirst({
    where: { veiculo_id: veiculo_id },
    orderBy: { num_serv: 'desc' }
  });
  return lastService ? lastService.num_serv + 1 : 1;
}


controller.retrieveAll = async function(req, res) {
  try {
    const result = await prisma.tipoServico.findMany({
      where: { oficina_id: OFICINA_ID },
      include: {
        servicos: {
          include: {
            veiculo: true
          },
          orderBy: {
            data_serv: 'desc'
          },
          take: 1 // Pega apenas o serviço mais recente
        },
        oficina: true
      },
      orderBy: { nome: 'asc' }
    });

    // Filtrar os serviços nulos e tratar os dados antes de enviar
    const filteredResult = result.map(tipoServico => ({
      ...tipoServico,
      servicos: tipoServico.servicos.filter(servico => servico.kmServ !== null)
    }));

    res.json(filteredResult);
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
    const { veiculo_id, kmServ, data_serv, ...tipoServicoData } = req.body;

    const updatedTipoServico = await prisma.$transaction(async (prisma) => {
      // Atualizar TipoServico
      const tipoServico = await prisma.tipoServico.update({
        where: { 
          id: req.params.id,
          oficina_id: OFICINA_ID
        },
        data: tipoServicoData
      });

      // Atualizar ou criar Servico
      let servico = await prisma.servico.findFirst({
        where: {
          tipoServico_id: tipoServico.id,
          veiculo_id: veiculo_id
        }
      });

      if (servico) {
        servico = await prisma.servico.update({
          where: { id: servico.id },
          data: {
            kmServ: parseInt(kmServ) || 0,
            data_serv: new Date(data_serv)
          }
        });
      } else {
        servico = await prisma.servico.create({
          data: {
            veiculo: { connect: { id: veiculo_id } },
            tipo_servico: { connect: { id: tipoServico.id } },
            num_serv: await getNextNumServ(prisma, veiculo_id),
            kmServ: parseInt(kmServ) || 0,
            data_serv: new Date(data_serv)
          }
        });
      }

      return { ...tipoServico, servicos: [servico] };
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
    console.error('Erro ao excluir tipo de serviço:', error);
    if (error.code === 'P2003') {
      res.status(400).json({ error: 'Não é possível excluir este tipo de serviço porque existem serviços associados a ele.' });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor ao excluir tipo de serviço' });
    }
  }
}

export default controller