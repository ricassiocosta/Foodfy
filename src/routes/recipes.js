const routes = require('express').Router()
const multer = require('../app/middlewares/multer')
const recipesController = require('../app/controllers/recipesController')
const recipesValidator = require('../app/validators/recipes')

routes.get('/', recipesValidator.index, recipesController.index)
routes.get('/criar', recipesController.create)
routes.get('/:recipe_id', recipesValidator.show, recipesController.show)
routes.get('/:recipe_id/editar', recipesValidator.edit, recipesController.edit)

routes.post('/', multer.array('photos', 5), recipesValidator.post, recipesController.post)
routes.put('/:recipe_id', multer.array('photos', 5), recipesValidator.put, recipesController.put)
routes.delete('/:recipe_id', recipesValidator.del, recipesController.delete)

module.exports = routes