const routes = require('express').Router()
const multer = require('../app/middlewares/multer')
const chefsController = require('../app/controllers/chefsController')
const chefsValidator = require('../app/validators/chefs')

routes.get('/', chefsController.index)
routes.get('/registrar', chefsValidator.manage, chefsController.create)
routes.get('/:chef_id', chefsController.show)
routes.get('/:chef_id/editar', chefsValidator.manage, chefsController.edit)

routes.post('/', multer.array('avatar', 1), chefsValidator.post, chefsController.post)
routes.put('/:chef_id', multer.array('avatar', 1), chefsController.put)
routes.delete('/:chef_id', chefsValidator.del, chefsController.delete)

module.exports = routes
