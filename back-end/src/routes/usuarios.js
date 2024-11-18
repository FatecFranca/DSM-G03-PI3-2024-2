import { Router } from 'express';
import controller from '../controllers/usuarios.js';

const router = Router();

// Rota para criar um novo usuário
router.post('/', controller.create);

// Rota para autenticação (login)
router.get('/login', controller.authenticate);

// Rota para recuperar todos os usuários
router.get('/', controller.retrieveAll);

// Rota para recuperar um usuário específico
router.get('/:id', controller.retrieveOne);

// Rota para atualizar um usuário
router.put('/:id', controller.update);

// Rota para deletar um usuário
router.delete('/:id', controller.delete);

export default router;