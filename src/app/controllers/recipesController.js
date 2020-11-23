const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")
const File = require("../models/File")

module.exports = {
  async create(req, res) {
    try {
      chefs = await Chef.findAll()
      return res.render("admin/recipes/create", { chefs })
    } catch (err) {
      console
    }
  },

  async post(req, res) {
    try {
      const { loggedUser } = req.session
      let data = req.body
      data.loggedUser = loggedUser.id
      const recipe = await Recipe.create(data)
      const filesPromise = req.files.map((file) => {
        File.createRecipeImages(file, recipe.id)
      })
      await Promise.all(filesPromise)

      return res.redirect(
        `/admin/receitas/${recipe.id}?status=success&from=create`
      )
    } catch (err) {
      console.error(err)
    }
  },

  async index(req, res) {
    try {
      if (req.is_admin) {
        const recipes = await returnAllRecipes()
        File.translateImagesURL(req, recipes)
        const data = { recipes }

        const { status, from } = req.query
        if (status == "success" && from == "delete") {
          data.success = "Receita apagada com sucesso!"
        }

        return res.render("admin/recipes/index", data)
      } else {
        const { recipes, filter, pagination } = await returnPaginatedRecipes()
        File.translateImagesURL(req, recipes)
        return res.render("site/recipes", { recipes, filter, pagination })
      }

      async function returnAllRecipes() {
        const recipes = await Recipe.all()
        recipes.sort((a, b) => {
          return a.updated_at < b.updated_at
            ? 1
            : b.updated_at < a.updated_at
            ? -1
            : 0
        })
        return recipes
      }

      async function returnPaginatedRecipes() {
        let { filter, page } = req.query
        page = page || 1
        let offset = 12 * (page - 1)

        const recipes = await Recipe.paginate(filter, offset)
        const pagination = {
          total: Math.ceil(recipes[0].total / 12),
          page,
        }

        recipes.sort((a, b) => {
          return a.updated_at < b.updated_at
            ? 1
            : b.updated_at < a.updated_at
            ? -1
            : 0
        })

        return { recipes, filter, pagination }
      }
    } catch (err) {
      console.error(err)
    }
  },

  async mostAccessed(req, res) {
    try {
      const recipes = await returnMostAccessedRecipes()

      async function returnMostAccessedRecipes() {
        const recipes = await Recipe.mostAccessed()
        return recipes
      }

      File.translateImagesURL(req, recipes)
      return res.render("site/home", { recipes })
    } catch (err) {
      console.error(err)
    }
  },

  async show(req, res) {
    try {
      const { loggedUser } = req.session
      const id = req.params.recipe_id

      let files = await Recipe.files(id)
      files = files.map((recipe) => ({
        ...recipe,
        src: `${req.protocol}://${req.headers.host}${recipe.path.replace(
          "public",
          ""
        )}`,
      }))

      if (!req.is_admin) {
        returnToSiteView()
      } else {
        returnToAdminView()
      }

      async function returnToSiteView() {
        let recipe = await Recipe.findOne({ where: { id } })
        recipe = {
          ...recipe,
          author: await Recipe.getAuthor(recipe.id),
        }
        if (recipe) {
          return res.render("site/recipe-detail", { recipe, files })
        } else {
          return res.status(404).send("Receita não encontrada!")
        }
      }

      async function returnToAdminView() {
        let recipe = await Recipe.findOne({ where: { id } })
        recipe = {
          ...recipe,
          author: await Recipe.getAuthor(recipe.id),
        }
        if (recipe) {
          const data = { recipe, files, loggedUser }

          const { status, from } = req.query
          if (status == "success" && from == "update") {
            data.success = "Atualização realizada com sucesso!"
          } else if (status == "success" && from == "create") {
            data.success = "Receita criada com sucesso!"
          } else if (status != null) {
            data.error = "Erro ao tentar atualizar, tente novamente!"
          }

          return res.render("admin/recipes/show", data)
        } else {
          return res.status(404).send("Receita não encontrada!")
        }
      }
    } catch (err) {
      console.error(err)
    }
  },

  async edit(req, res) {
    try {
      const id = req.params.recipe_id
      const recipeData = await getRecipeData(id)
      const chefsListing = await getChefsListing()

      async function getRecipeData(id) {
        const recipe = await Recipe.findOne({ where: { id } })
        return recipe
      }

      async function getChefsListing() {
        const chefsListing = await Chef.findAll()
        return chefsListing
      }

      let files = await Recipe.files(id)
      files = files.map((recipe) => ({
        ...recipe,
        src: `${req.protocol}://${req.headers.host}${recipe.path.replace(
          "public",
          ""
        )}`,
      }))

      return res.render("admin/recipes/edit", {
        recipe: recipeData,
        chefs: chefsListing,
        files,
      })
    } catch (err) {
      console.error(err)
    }
  },

  async put(req, res) {
    try {
      const id = req.params.recipe_id

      const recipe = await Recipe.findOne({ where: { id } })
      if (recipe) {
        await Recipe.update(req.body)
        return res.redirect(`/admin/receitas/${id}?status=success&from=update`)
      } else {
        return res.status(404).send("receita não encontrada")
      }
    } catch (err) {
      console.error(err)
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.recipe_id
      let results = await Recipe.findOne({ where: { id } })
      const recipe = results.rows[0]

      if (recipe) {
        await Recipe.delete(id)
        return res.redirect("/admin/receitas?status=success&from=delete")
      } else {
        return res.status(404).send("receita não encontrada")
      }
    } catch (err) {
      console.error(err)
    }
  },
}
