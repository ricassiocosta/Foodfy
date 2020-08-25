const routes = require('express').Router()
const recipesController = require('../app/controllers/recipesController')
const chefsController = require('../app/controllers/chefsController')
const recipes = require('./recipes')
const chefs = require('./chefs')

routes.get('/', recipesController.mostAccessed)
routes.get('/sobre', (req, res) => { return res.render('site/about') })
routes.get('/receitas', recipesController.index)
routes.get('/chefs', chefsController.listing)
routes.get('/receitas/:recipe_id', recipesController.show)

routes.get('/admin', (req, res) => { return res.redirect('/admin/receitas')})

routes.use('/admin/receitas', recipes)
routes.use('/admin/chefs', chefs)

module.exports = routes