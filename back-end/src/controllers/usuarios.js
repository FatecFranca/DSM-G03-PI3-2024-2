import prisma from '../database/client.js';
import bcrypt from 'bcrypt';

const controller = {};

controller.create = async function(req, res) {
  try {
    // Extrair os dados do corpo da requisição
    const { nome, cpf, data_nascimento, email, logradouro, num_casa, complemento, 
            bairro, municipio, uf, cep, senha, celular } = req.body;

    // Hashear a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar o usuário com a senha hasheada
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        cpf,
        data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
        email,
        logradouro,
        num_casa,
        complemento,
        bairro,
        municipio,
        uf,
        cep,
        senha: senhaHash, // Usar a senha hasheada
        celular
      }
    });

    // Responder com sucesso, mas sem enviar a senha de volta
    res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email
      // Adicione outros campos que você queira retornar, exceto a senha
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Email ou CPF já cadastrado.' });
    } else {
      res.status(500).json({ message: 'Erro interno do servidor ao criar usuário.' });
    }
  }
};

controller.retrieveAll = async function(req, res) {
  try {
    const result = await prisma.usuario.findMany({ 
      orderBy: [{ nome: 'asc' }],
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        celular: true
        // Adicione outros campos que você quer retornar, exceto a senha
      }
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar usuários.' });
  }
};

controller.retrieveOne = async function(req, res) {
  try {
    const result = await prisma.usuario.findUnique({ 
      where: { id: req.params.id },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        data_nascimento: true,
        logradouro: true,
        num_casa: true,
        complemento: true,
        bairro: true,
        municipio: true,
        uf: true,
        cep: true,
        celular: true
        // Não incluímos a senha aqui
      }
    });
    if (result) res.json(result);
    else res.status(404).json({ message: 'Usuário não encontrado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar usuário.' });
  }
};

controller.update = async function(req, res) {
  try {
    const { senha, ...dadosAtualizacao } = req.body;
    
    // Se uma nova senha for fornecida, hashear antes de atualizar
    if (senha) {
      dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
    }

    const result = await prisma.usuario.update({ 
      where: { id: req.params.id }, 
      data: dadosAtualizacao 
    });
    
    if (result) res.status(204).end();
    else res.status(404).json({ message: 'Usuário não encontrado' });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Email ou CPF já em uso por outro usuário.' });
    } else {
      res.status(500).json({ message: 'Erro interno do servidor ao atualizar usuário.' });
    }
  }
};

controller.delete = async function(req, res) {
  try {
    await prisma.usuario.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Usuário não encontrado' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor ao deletar usuário.' });
    }
  }
};

controller.authenticate = async function(req, res) {
  try {
    const { email, senha } = req.query;
    console.log('Tentativa de login para:', email);

    // Verifica se o usuário existe
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    console.log('Usuário encontrado:', usuario ? 'Sim' : 'Não');

    if (!usuario) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ message: 'E-mail ou senha incorretos' });
    }

    console.log('Senha armazenada (hash):', usuario.senha);
    console.log('Senha fornecida:', senha);

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
    console.log('Senha válida:', isPasswordValid ? 'Sim' : 'Não');

    if (!isPasswordValid) {
      console.log('Senha incorreta');
      return res.status(401).json({ message: 'E-mail ou senha incorretos' });
    }

    console.log('Usuário autenticado:', usuario.id);

    // Envia o ID do usuário
    res.json({ id: usuario.id, message: 'Login bem-sucedido' });
  } catch (error) {
    console.error('Erro durante a autenticação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export default controller;