const routes = require('express').Router()

const userController = require('../app/controllers/userController')
const userValidator  = require('../app/validators/user')

routes.get('/', userController.index)
routes.post('/', userValidator.create, userController.post)
routes.get('/registrar', userValidator.create, userController.create)
routes.get('/:id/editar', userController.edit)
routes.put('/:id', userValidator.put, userController.put)
routes.get('/:id/deletar', userValidator.del, userController.delete)

module.exports = routes