const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
  mostAccessed(req, res) {
    Recipe.mostAccessed()
    .then((results) => {
      const recipes = results.rows
      return res.render('site/home', { recipes })
    }).catch((err) => {
      throw new Error(err)
    })
  },

  index(req, res) {
    if(req.url.includes("admin")) {
      Recipe.all()
      .then((results) => {
        const recipes = results.rows
        return res.render('admin/recipes/index', { recipes })
      }).catch((err) => {
        throw new Error(err)
      })
    } else {
      let { filter, page } = req.query
      page = page || 1
      let offset = 12 * (page - 1)

      Recipe.paginate(filter, offset)
      .then((results) => {

        const recipes = results.rows
        const pagination = {
          total: Math.ceil(recipes[0].total / 12),
          page
        }

        return res.render('site/recipes', { recipes, filter, pagination})
      }).catch((err) => {
        throw new Error(err)
      })
    }
  },

  create(req, res) {
    Chef.listing()
    .then((results) => {
      const chefs = results.rows
      return res.render('admin/recipes/create', { chefs })
    }).catch((err) => {
      throw new Error(err)
    })
  },

  show(req, res) {
    const recipeID = req.params.recipe_id

    if(req.url.includes('admin')) {
      Recipe.show(recipeID)
      .then((results) => {
        const recipe = results.rows[0]
        if(recipe) {
          return res.render('admin/recipes/show', { recipe })
        } else {
          return res.status(404).send('Receita não encontrada!')
        }
      }).catch((err) => {
        throw new Error(err)
      })
    } else {
      Recipe.show(recipeID)
      .then((results) => {
        const recipe = results.rows[0]
        if(recipe) {
          return res.render('site/recipe-detail', { recipe })
        } else {
          return res.status(404).send('Receita não encontrada!')
        }
      }).catch((err) => {
        throw new Error(err)
      })
    }
  },

  async edit(req, res) {
    const recipeID = req.params.recipe_id
    let recipe = {}
    let chefs = {}

    await Recipe.show(recipeID)
    .then((results) => {
      recipe = results.rows[0]
    }).catch((err) => {
      throw new Error(err)
    })

    await Chef.listing()
    .then((results) => {
      chefs = results.rows
    }).catch((err) => {
      throw new Error(err)
    })

    return res.render('admin/recipes/edit', { recipe, chefs })
  },

  post(req, res) {
    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }

    Recipe.create(req.body)
    .then((results) => {
      const recipe = results.rows[0]
      return res.redirect(`/admin/receitas/${recipe.id}`)
    }).catch((err) => {
      throw new Error(err)
    })
  },

  put(req, res) {
    const recipeID = req.params.recipe_id

    Recipe.show(recipeID)
    .then((results) => {
      const recipe = results.rows[0]
      if(recipe) {
        Recipe.update(req.body)
        .then(() => {
          return res.redirect(`/admin/receitas/${recipeID}`)
        }).catch((err) => {
          throw new Error(err)
        })
      } else {
        return res.status(404).send('receita não encontrada')
      }
    }).catch((err) => {
      throw new Error(err)
    })
  },

  delete(req, res) {
    const recipeID = req.params.recipe_id

    Recipe.show(recipeID)
    .then((results) => {
      const recipe = results.rows[0]
      if(recipe) {
        Recipe.delete(recipeID)
        .then(() => {
          return res.redirect('/admin/receitas')
        }).catch((err) => {
          throw new Error(err)
        })
      } else {
        return res.status(404).send('receita não encontrada')
      }
    }).catch((err) => {
      throw new Error(err)
    })
  },
} 