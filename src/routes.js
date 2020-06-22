const express = require('express')
const recipesController = require('./controllers/recipesController')

const routes = express.Router()

routes.get('/', recipesController.recipeHighlights)
routes.get('/sobre', (req, res) => { return res.render('about') })
routes.get('/receitas', recipesController.index)
routes.get('/receitas/:recipe_id', recipesController.show)

routes.get('/admin', (req, res) => { return res.redirect('/admin/receitas')})
routes.get('/admin/receitas', recipesController.adminIndex)
routes.get('/admin/receitas/criar', recipesController.create)
routes.get('/admin/receitas/:recipe_id', recipesController.adminShow)
routes.get('/admin/receitas/:recipe_id/editar', recipesController.edit)

routes.post('/admin/receitas', recipesController.post)
routes.put('/admin/receitas/:recipe_id', recipesController.put)
routes.delete('/admin/receitas/:recipe_id', recipesController.delete)

module.exports = routes