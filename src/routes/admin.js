const routes = require('express').Router()

const userController = require('../app/controllers/userController')
const userValidator  = require('../app/validators/user')
const recipes = require('./recipes')
const chefs = require('./chefs')


routes.get('/', (req, res) => { return res.redirect('/admin/receitas')})
routes.use('/receitas', recipes)
routes.use('/chefs', chefs)

routes.get('/usuarios', userController.index)
routes.post('/usuarios', userValidator.create, userController.post)
routes.get('/usuarios/registrar', userController.create)

module.exports = routes