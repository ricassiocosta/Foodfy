const routes = require('express').Router()

const userController = require('../app/controllers/userController')
const userValidator  = require('../app/validators/user')

routes.get('/', userController.index)
routes.post('/', userValidator.create, userController.post)
routes.get('/registrar', userController.create)
routes.get('/:id/editar', userController.edit)
routes.put('/:id', userValidator.edit, userController.put)

module.exports = routes