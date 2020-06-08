const express = require('express')
const nunjucks = require('nunjucks')

const recipes = require('./data')

const server = express()

server.listen(5000)
server.use(express.static('public'))
server.set('view engine', 'njk')
nunjucks.configure('src/views', {
  express: server,
  autoescape: false,
  noCache: true
})

server.get('/', (req, res) => {
  return res.render('home', {
    recipes: recipes.slice(0, 6)
  })
})

server.get('/sobre', (req, res) => {
  return res.render('about')
})

server.get('/receitas', (req, res) => {
  return res.render('recipes', {
    recipes
  })
})

server.get('/receitas/:recipeIndex', (req, res) => {
  const recipeIndex = req.params.recipeIndex
  const recipe = recipes[recipeIndex]
  if(!recipe) {
    return res.send('receita não encontrada')
  }

  return res.render('recipe-detail', {recipe})
})