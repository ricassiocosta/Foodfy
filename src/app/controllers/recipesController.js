const fs = require('fs')
const data = require('../../data.json')
const Recipe = require('../models/Recipe')

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

exports.adminIndex = (req, res) => {
  return res.render('admin/recipes', {
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

exports.create = (req, res) => {
  return res.render('admin/recipe-creation')
}

exports.edit = (req, res) => {
  const recipeID = req.params.recipe_id
  const recipe = data.recipes.find((recipe) => {
    return recipe.id == recipeID
  })

  if(!recipe) {
    return res.send('receita não encontrada')
  }

  return res.render('admin/recipe-edit', {recipe})
}

exports.post = (req, res) => {
  const keys = Object.keys(req.body)
  for(key of keys) {
    if(req.body[key] == "") {
      return res.send('Por favor, preencha todos os campos!')
    }
  }

  Recipe.create(req.body, (recipe) => {
    return res.redirect(`admin/receitas/${recipe}`)
  })
}

exports.put = (req, res) => {
  const recipeID = req.params.recipe_id
  let index = 0
  const recipe = data.recipes.find((recipe, foundIndex) => {
    index = foundIndex
    return recipe.id == recipeID
  })

  if(!recipe) {
    return res.send('receita não encontrada')
  }

  const { title, image, ingredients, preparation, information } = req.body

  const updatedRecipe = {
    ...recipe,
    title,
    image,
    ingredients,
    preparation,
    information
  }

  data.recipes[index] = updatedRecipe

  fs.writeFile('src/data.json', JSON.stringify(data, null, 2), (err) => {
    if(err) return res.send('Erro ao atualizar as informações')
    return res.redirect(`/admin/receitas/${recipeID}`)
  })
} 

exports.delete = (req, res) => {
  const recipeID = req.params.recipe_id
  let index = 0
  const recipe = data.recipes.find((recipe, foundIndex) => {
    index = foundIndex
    return recipe.id == recipeID
  })

  if(!recipe) {
    return res.send('receita não encontrada')
  }

  data.recipes.splice(index, 1)

  fs.writeFile('src/data.json', JSON.stringify(data, null, 2), (err) => {
    if(err) return res.send('Erro ao atualizar as informações')
    return res.redirect("/receitas")
  })
} 