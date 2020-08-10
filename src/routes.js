const express = require('express')
const multer = require('./app/middlewares/multer')
const recipesController = require('./app/controllers/recipesController')
const chefsController = require('./app/controllers/chefsController')

const routes = express.Router()

routes.get('/', recipesController.mostAccessed)
routes.get('/sobre', (req, res) => { return res.render('site/about') })
routes.get('/receitas', recipesController.index)
routes.get('/chefs', chefsController.listing)
routes.get('/receitas/:recipe_id', recipesController.show)

routes.get('/admin', (req, res) => { return res.redirect('/admin/receitas')})
routes.get('/admin/receitas', recipesController.index)
routes.get('/admin/receitas/criar', recipesController.create)
routes.get('/admin/receitas/:recipe_id', recipesController.show)
routes.get('/admin/receitas/:recipe_id/editar', recipesController.edit)

routes.post('/admin/receitas', multer.array('photos', 5), recipesController.post)
routes.put('/admin/receitas/:recipe_id', multer.array('photos', 5), recipesController.put)
routes.delete('/admin/receitas/:recipe_id', recipesController.delete)

routes.get('/admin/chefs', chefsController.index)
routes.get('/admin/chefs/registrar', chefsController.create)
routes.get('/admin/chefs/:chef_id', chefsController.show)
routes.get('/admin/chefs/:chef_id/editar', chefsController.edit)

routes.post('/admin/chefs', multer.array('avatar', 1), chefsController.post)
routes.put('/admin/chefs/:chef_id', multer.array('avatar', 1), chefsController.put)
routes.delete('/admin/chefs/:chef_id', chefsController.delete)

module.exports = routes