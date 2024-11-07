import { Router } from 'express'
import controller from '../controllers/veiculos.js'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

// Rotas para os itens da venda
router.post('/:id/servicos', controller.createServico)
router.get('/:id/servicos', controller.retrieveAllServicos)
router.get('/:id/servicos/:servicoId', controller.retrieveOneServico)
router.put('/:id/servicos/:servicoId', controller.updateServico)
router.delete('/:id/servicos/:servicoId', controller.deleteServico)

export default router