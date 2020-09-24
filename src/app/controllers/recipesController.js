const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
  create(req, res) {
    Chef.listing()
    .then((results) => {
      const chefs = results.rows
      return res.render('admin/recipes/create', { chefs })
    }).catch((err) => {
      throw new Error(err)
    })
  },

  async post(req, res) {
    const { loggedUser } = req.session
    Recipe.create(req.body, loggedUser)
    .then(async (results) => {
      const recipe = results.rows[0]
      const filesPromise = req.files.map(file => {
        File.createRecipeImages(file, recipe.id)
      })
      await Promise.all(filesPromise)

      return res.redirect(`/admin/receitas/${recipe.id}?status=success&from=create`)
    }).catch((err) => {
      throw new Error(err)
    })
  },

  async index(req, res) {
    if(req.is_admin) {
      const recipes = await returnAllRecipes()
      File.translateImagesURL(req, recipes)
      const data = { recipes }

      const { status, from } = req.query
      if(status == 'success' && from == 'delete') {
        data.success = 'Receita apagada com sucesso!'
      }

      return res.render('admin/recipes/index', data)
    } else {
      const { recipes, filter, pagination } = await returnPaginatedRecipes()
      File.translateImagesURL(req, recipes)
      return res.render('site/recipes', { recipes, filter, pagination})
    }

    async function returnAllRecipes() {
      let results = await Recipe.all()
      const recipes = results.rows
      recipes.sort((a,b) => {
        return (a.updated_at < b.updated_at) ? 1 : ((b.updated_at < a.updated_at) ? -1 : 0)
      })
      return recipes
    }

    async function returnPaginatedRecipes() {
      let { filter, page } = req.query
      page = page || 1
      let offset = 12 * (page - 1)

      let results = await Recipe.paginate(filter, offset)
      const recipes = results.rows
      const pagination = {
        total: Math.ceil(recipes[0].total / 12),
        page
      }
      
      recipes.sort((a,b) => {
        return (a.updated_at < b.updated_at) ? 1 : ((b.updated_at < a.updated_at) ? -1 : 0)
      })

      return { recipes, filter, pagination }
    }

  },

  async mostAccessed(req, res) {
    const recipes = await returnMostAccessedRecipes()
    
    async function returnMostAccessedRecipes() {
      let results = await Recipe.mostAccessed()
      const recipes = results.rows
      return recipes
    }
    
    File.translateImagesURL(req, recipes)
    return res.render('site/home', { recipes })
  },

  async show(req, res) {
    const { loggedUser } = req.session
    const recipeId = req.params.recipe_id

    let results = await Recipe.files(recipeId) 
    const files = results.rows.map(recipe => ({
      ...recipe,
      src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
    }))

    if(!req.is_admin) {
      returnToSiteView()
    } else {
      returnToAdminView()
    }
    
    function returnToSiteView() {
      Recipe.show(recipeId)
      .then((results) => {
        const recipe = results.rows[0]
        if(recipe) {
          return res.render('site/recipe-detail', { recipe, files })
        } else {
          return res.status(404).send('Receita não encontrada!')
        }
      }).catch((err) => {
        throw new Error(err)
      })
    }

    function returnToAdminView() {
      Recipe.show(recipeId)
      .then((results) => {
        const recipe = results.rows[0]
        if(recipe) {
          const data = { recipe, files, loggedUser }

          const { status, from } = req.query
          if(status == 'success' && from == 'update') {
            data.success = 'Atualização realizada com sucesso!'
          } else if(status == 'success' && from == 'create') {
            data.success = 'Receita criada com sucesso!'
          } else if(status != null) {
            data.error = 'Erro ao tentar atualizar, tente novamente!'
          }

          return res.render('admin/recipes/show', data)
        } else {
          return res.status(404).send('Receita não encontrada!')
        }
      }).catch((err) => {
        throw new Error(err)
      })
    }
  },

  async edit(req, res) {
    const recipeId = req.params.recipe_id

    const recipeData = await getRecipeData(recipeId)
    const chefsListing = await getChefsListing()

    async function getRecipeData(recipeId) {
      let results = await Recipe.show(recipeId)
      const recipeData = results.rows[0]
      return recipeData
    }

    async function getChefsListing() {
      let results = await Chef.listing()
      const chefsListing = results.rows
      return chefsListing
    }

    let results = await Recipe.files(recipeId) 
    const files = results.rows.map(recipe => ({
      ...recipe,
      src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
    }))

    return res.render('admin/recipes/edit', { recipe: recipeData, chefs:chefsListing, files })
  },

  async put(req, res) {
    const recipeId = req.params.recipe_id

    let results = await Recipe.show(recipeId)
    const recipe = results.rows[0]
    if(recipe) {
      Recipe.update(req.body)
      .then(() => {
        return res.redirect(`/admin/receitas/${recipeId}?status=success&from=update`)
      }).catch((err) => {
        throw new Error(err)
      })
    } else {
      return res.status(404).send('receita não encontrada')
    }
  },

  async delete(req, res) {
    const recipeId = req.params.recipe_id

    let results = await Recipe.show(recipeId)
    const recipe = results.rows[0]

    if(recipe) {
      Recipe.delete(recipeId)
      .then(() => {
        return res.redirect('/admin/receitas?status=success&from=delete')
      }).catch((err) => {
        throw new Error(err)
      })
    } else {
      return res.status(404).send('receita não encontrada')
    }
  },
} 