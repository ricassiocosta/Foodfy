const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
  async mostAccessed(req, res) {
    const recipes = await returnMostAccessedRecipes()
    translateImagesURL(recipes)
    
    return res.render('site/home', { recipes })
    
    async function returnMostAccessedRecipes() {
      let results = await Recipe.mostAccessed()
      const recipes = results.rows
      return recipes
    }

    function translateImagesURL(recipes) {
      recipes.map((recipe, index) => {
        recipes[index].image = {
          name: `${recipe.title}`,
          src: `${req.protocol}://${req.headers.host}${recipe.image.replace("public", "")}`
        }
      })
    }
  },

  async index(req, res) {
    if(req.url.includes("admin")) {
      const recipes = await returnAllRecipes()
      translateImagesURL(recipes)
      return res.render('admin/recipes/index', { recipes })
    } else {
      const { recipes, filter, pagination } = await returnPaginatedRecipes()
      translateImagesURL(recipes)
      return res.render('site/recipes', { recipes, filter, pagination})
    }

    async function returnAllRecipes() {
      let results = await Recipe.all()
      const recipes = results.rows
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
      return { recipes, filter, pagination }
    }

    function translateImagesURL(recipes) {
      recipes.map((recipe, index) => {
        recipes[index].image = {
          name: `${recipe.title}`,
          src: `${req.protocol}://${req.headers.host}${recipe.image.replace("public", "")}`
        }
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

  async show(req, res) {
    const recipeID = req.params.recipe_id

    let results = await Recipe.files(recipeID) 
    const files = results.rows.map(recipe => ({
      ...recipe,
      src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
    }))

    if(!req.url.includes('admin')) {
      returnSiteView()
    } else {
      returnAdminView()
    }
    
    function returnSiteView() {
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

    function returnAdminView() {
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

  edit(req, res) {
    const recipeID = req.params.recipe_id

    getRecipeData(recipeID)
    .then((recipeData) => {
      getChefsListing()
      .then( async (chefsListing) => {
        let results = await Recipe.files(recipeID) 
        const files = results.rows.map(recipe => ({
          ...recipe,
          src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
        }))
        return res.render('admin/recipes/edit', { recipe: recipeData, chefs:chefsListing, files })
      })
    })

    async function getRecipeData(recipeID) {
      return Recipe.show(recipeID)
      .then((results) => {
        return results.rows[0]
      }).catch((err) => {
        throw new Error(err)
      })
    }

    async function getChefsListing() {
      return Chef.listing()
      .then((results) => {
        return results.rows
      }).catch((err) => {
        throw new Error(err)
      })
    }
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
        File.create(file, recipe.id)
      })
      await Promise.all(filesPromise)

      return res.redirect(`/admin/receitas/${recipe.id}`)
    }).catch((err) => {
      throw new Error(err)
    })
  },

  async put(req, res) {
    const recipeID = req.params.recipe_id

    if(req.files.length != 0) {
      const newFilesPromise = req.files.map(file => File.create(file, req.body.id))
      await Promise.all(newFilesPromise)
    }

    if(req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",")
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex, 1)

      const removedFilesPromise = removedFiles.map(id => File.delete(id))
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