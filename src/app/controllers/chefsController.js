const Chef = require("../models/Chef")
const File = require("../models/File")

module.exports = {
  create(req, res) {
    return res.render("admin/chefs/create")
  },

  async post(req, res) {
    try {
      const chef = await Chef.create(req.body)
      File.createChefAvatar(req.files[0], chef.id)
      return res.redirect(`/admin/chefs/${chef.id}?status=success&from=create`)
    } catch (err) {
      console.error(err)
    }
  },

  async listing(req, res) {
    try {
      let chefs = await Chef.findAll()
      chefsPromise = chefs.map(async (chef) => ({
        ...chef,
        avatar_url: await Chef.getAvatar(chef.id),
      }))
      chefs = await Promise.all(chefsPromise)

      const chefsListing = chefs.map((chef) => ({
        ...chef,
        avatar_url: `${req.protocol}://${
          req.headers.host
        }${chef.avatar_url.replace("public", "")}`,
      }))
      return res.render("site/chefs", { chefs: chefsListing })
    } catch (err) {
      console.error(err)
    }
  },

  async index(req, res) {
    try {
      const { loggedUser } = req.session
      let data = { loggedUser }
      let chefs = await Chef.findAll()

      if (chefs.length == 0) {
        return res.render("admin/chefs/index", data)
      }

      chefsPromise = chefs.map(async (chef) => ({
        ...chef,
        avatar_url: await Chef.getAvatar(chef.id),
      }))
      chefs = await Promise.all(chefsPromise)

      const chefsListing = chefs.map((chef) => ({
        ...chef,
        avatar_url: `${req.protocol}://${
          req.headers.host
        }${chef.avatar_url.replace("public", "")}`,
      }))

      data.chefs = chefsListing

      const { status, from } = req.query
      if (status == "success" && from == "delete") {
        data.success = "Chef apagado com sucesso!"
      }

      return res.render("admin/chefs/index", data)
    } catch (err) {
      console.error(err)
    }
  },

  async show(req, res) {
    try {
      const { loggedUser } = req.session
      const id = req.params.chef_id

      let chef = await Chef.findOne({ where: { id } })
      chef = {
        ...chef,
        avatar_url: await Chef.getAvatar(id),
      }

      chef = {
        ...chef,
        avatar_url: `${req.protocol}://${
          req.headers.host
        }${chef.avatar_url.replace("public", "")}`,
      }

      let recipes = await Chef.getRecipes(id)
      File.translateImagesURL(req, recipes)

      const data = { chef, recipes, loggedUser }

      const { status, from } = req.query
      if (status == "success" && from == "update") {
        data.success = "Atualização realizada com sucesso!"
      } else if (status == "success" && from == "create") {
        data.success = "Chef criado com sucesso!"
      } else if (status != null) {
        data.error = "Erro ao tentar atualizar, tente novamente!"
      }

      return res.render("admin/chefs/show", data)
    } catch (err) {
      console.error(err)
    }
  },

  async edit(req, res) {
    try {
      const id = req.params.chef_id
      let chef = await Chef.findOne({ where: { id } })
      chef = {
        ...chef,
        avatar_url: await Chef.getAvatar(id),
      }
      chef = {
        ...chef,
        avatar_url: `${req.protocol}://${
          req.headers.host
        }${chef.avatar_url.replace("public", "")}`,
      }

      return res.render("admin/chefs/edit", { chef })
    } catch (err) {
      console.error(err)
    }
  },

  async put(req, res) {
    try {
      const id = req.params.chef_id
      Chef.update(id, req.body)
      if (req.files.length != 0) {
        await Chef.updateAvatar(id, req.files[0])
      }

      return res.redirect(
        `/admin/chefs/${req.body.id}?status=success&from=update`
      )
    } catch (err) {
      console.error(err)
    }
  },

  async delete(req, res) {
    Chef.delete(req.params.chef_id)
    return res.redirect("/admin/chefs?status=success&from=delete")
  },
}
