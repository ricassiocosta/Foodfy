const data = require('../data.json')

exports.recipeHighlights = (req, res) => {
  return res.render('home', {
    recipes: data.recipes.slice(0,6)
  })
}

exports.index = (req, res) => {
  return res.render('recipes', {
    recipes: data.recipes
  })
}

exports.show = (req, res) => {
  const recipeID = req.params.recipe_id
  const recipe = data.recipes.find((recipe) => {
    return recipe.id == recipeID
  })

  if(!recipe) {
    return res.send('receita não encontrada')
  }

  return res.render('recipe-detail', {recipe})
}

exports.adminShow = (req, res) => {
  const recipeID = req.params.recipe_id
  const recipe = data.recipes.find((recipe) => {
    return recipe.id == recipeID
  })
  if(!recipe) {
    return res.send('receita não encontrada')
  }

  return res.render('admin/recipe-detail', {recipe})
}

exports.update = (req, res) => {
  const recipeID = req.params.recipe_id
  const recipe = data.recipes.find((recipe) => {
    return recipe.id == recipeID
  })

  if(!recipe) {
    return res.send('receita não encontrada')
  }

  return res.render('admin/recipe-edit', {recipe})
}