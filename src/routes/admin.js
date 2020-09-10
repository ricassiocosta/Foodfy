const routes = require('express').Router()

const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')

routes.get('/', (req, res) => { return res.redirect('/admin/receitas')})
routes.use('/receitas', recipes)
routes.use('/chefs', chefs)
routes.use('/usuarios', users)

module.exports = routes