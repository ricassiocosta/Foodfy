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
    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }

    if(req.files.length == 0) {
      return res.send('Por favor, envie ao menos uma imagem!')
    }

    Recipe.create(req.body)
    .then(async (results) => {
      const recipe = results.rows[0]
      const filesPromise = req.files.map(file => {
        File.createRecipeImages(file, recipe.id)
      })
      await Promise.all(filesPromise)

      return res.redirect(`/admin/receitas/${recipe.id}`)
    }).catch((err) => {
      throw new Error(err)
    })
  },

  async index(req, res) {
    if(req.url.includes("admin")) {
      const recipes = await returnAllRecipes()
      File.translateImagesURL(req, recipes)
      return res.render('admin/recipes/index', { recipes })
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
    const recipeID = req.params.recipe_id

    let results = await Recipe.files(recipeID) 
    const files = results.rows.map(recipe => ({
      ...recipe,
      src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
    }))

    if(!req.url.includes('admin')) {
      returnToSiteView()
    } else {
      returnToAdminView()
    }
    
    function returnToSiteView() {
      Recipe.show(recipeID)
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
      Recipe.show(recipeID)
      .then((results) => {
        const recipe = results.rows[0]
        if(recipe) {
          return res.render('admin/recipes/show', { recipe, files })
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

    const recipeData = await getRecipeData(recipeID)
    const chefsListing = await getChefsListing()

    async function getRecipeData(recipeID) {
      let results = await Recipe.show(recipeID)
      const recipeData = results.rows[0]
      return recipeData
    }

    async function getChefsListing() {
      let results = await Chef.listing()
      const chefsListing = results.rows
      return chefsListing
    }

    let results = await Recipe.files(recipeID) 
    const files = results.rows.map(recipe => ({
      ...recipe,
      src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
    }))

    return res.render('admin/recipes/edit', { recipe: recipeData, chefs:chefsListing, files })
  },

  async put(req, res) {
    const recipeID = req.params.recipe_id

    if(req.files.length != 0) {
      const newFilesPromise = req.files.map(file => File.createRecipeImages(file, req.body.id))
      await Promise.all(newFilesPromise)
    }

    if(req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",")
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex, 1)

      const removedFilesPromise = removedFiles.map(id => File.deleteFile(id))
      await Promise.all(removedFilesPromise)
    }

    let results = await Recipe.show(recipeID)
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
  },

  async delete(req, res) {
    const recipeID = req.params.recipe_id

    let results = await Recipe.show(recipeID)
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
  },
} 