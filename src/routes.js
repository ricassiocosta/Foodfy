const express = require('express')
const data = require('./data.json')


const routes = express.Router()

routes.get('/', (req, res) => {
  return res.render('home', {
    recipes: data.recipes.slice(0,6)
  })
})

routes.get('/sobre', (req, res) => {
  return res.render('about')
})

routes.get('/receitas', (req, res) => {
  return res.render('recipes', {
    recipes: data.recipes.slice(0,6)

  })
})

routes.get('/receitas/:recipeIndex', (req, res) => {
  const recipeIndex = req.params.recipeIndex
  const recipe = data.recipes[recipeIndex]
  if(!recipe) {
    return res.send('receita não encontrada')
  }

  return res.render('recipe-detail', {recipe})
})

module.exports = routes