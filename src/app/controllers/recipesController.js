const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
  mostAccessed(req, res) {
    Recipe.mostAccessed((recipes) => {
      return res.render('site/home', {
        recipes
      })
    })
  },

  index(req, res) {
    let { filter, page } = req.query

    page = page || 1
    let offset = 12 * (page - 1)

    const params = {
      filter,
      page,
      offset,
      callback(recipes) {
        const pagination = {
          total: Math.ceil(recipes[0].total / 12),
          page
        }
        return res.render('site/recipes', { recipes, filter, pagination})
      }
    }

    Recipe.paginate(params)
  },

  indexAdmin(req, res) {
    Recipe.all((recipes) => {
      return res.render('admin/recipes/index', {
        recipes
      })
    })
  },

  show(req, res) {
    const recipeID = req.params.recipe_id
    Recipe.find(recipeID, (recipe) => {
      if(!recipe) {
        return res.send('receita não encontrada')
      }
    }) 

    Recipe.show(recipeID, (recipe) => {
      return res.render('site/recipe-detail', {
        recipe
      })
    })
  },

  showAdmin(req, res) {
    const recipeID = req.params.recipe_id
    Recipe.find(recipeID, (recipe) => {
      if(!recipe) {
        return res.send('receita não encontrada')
      }
    })

    Recipe.show(recipeID, (recipe) => {
      return res.render('admin/recipes/show', {
        recipe
      })
    })
  },

  create(req, res) {
    Chef.all((chefs) => {
      return res.render('admin/recipes/create', {
        chefs
      })
    })
  },

  edit(req, res) {
    const recipeID = req.params.recipe_id
    const recipe = Recipe.find(recipeID, (recipe) => {
      if(!recipe) {
        return res.send('receita não encontrada')
      }
    }) 

    Recipe.show(recipeID, (recipe) => {
      Chef.all((chefs) => {
        return res.render('admin/recipes/edit', {
          recipe,
          chefs
        })
      })
    })
  },

  post(req, res) {
    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }

    Recipe.create(req.body, (recipe) => {
      return res.redirect(`receitas/${recipe.id}`)
    })
  },

  put(req, res) {
    const recipeID = req.params.recipe_id
    const recipe = Recipe.find(recipeID, (recipe) => {
      if(!recipe) {
        return res.send('receita não encontrada')
      }
    }) 

    Recipe.update(req.body, () => {
      return res.redirect(`/admin/receitas/${recipeID}`)
    })
  },

  delete(req, res) {
    const recipeID = req.params.recipe_id
    Recipe.find(recipeID, (recipe) => {
      if(!recipe) {
        return res.send('receita não encontrada')
      }
    }) 

    Recipe.delete(recipeID, () => {
      return res.redirect('/admin/receitas')
    })
  },
} 