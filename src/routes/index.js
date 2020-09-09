const routes = require('express').Router()
const recipesController = require('../app/controllers/recipesController')
const chefsController = require('../app/controllers/chefsController')
const sessionController = require('../app/controllers/sessionController')
const userController = require('../app/controllers/userController')
const recipes = require('./recipes')
const chefs = require('./chefs')

routes.get('/', recipesController.mostAccessed)
routes.get('/sobre', (req, res) => { return res.render('site/about') })
routes.get('/receitas', recipesController.index)
routes.get('/chefs', chefsController.listing)
routes.get('/receitas/:recipe_id', recipesController.show)
routes.get('/login', sessionController.login)

routes.get('/admin', (req, res) => { return res.redirect('/admin/receitas')})
routes.use('/admin/receitas', recipes)
routes.use('/admin/chefs', chefs)

routes.get('/admin/usuarios', userController.index)
routes.post('/admin/usuarios', userController.post)
routes.get('/admin/usuarios/registrar', userController.create)


module.exports = routes