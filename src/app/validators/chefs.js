const Chef = require("../models/Chef")

function post(req, res, next) {
  try {
    const { loggedUser } = req.session
    if (!loggedUser.is_admin)
      return res.redirect("/admin", {
        error: "Somente administradores podem criar novos chefs",
      })

    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] == "") {
        return res.render("admin/chefs/create", {
          error: "Por favor, preencha todos os campos!",
        })
      }
    }

    if (!req.files) {
      return res.render("admin/chefs/create", {
        error: "Por favor, envie uma imagem de avatar!",
      })
    }

    next()
  } catch (err) {
    console.error(err)
  }
}

function manage(req, res, next) {
  const { loggedUser } = req.session
  if (!loggedUser.is_admin)
    return res.render("admin/chefs/index", {
      error: "Somente administradores podem atualizar chefs",
    })

  next()
}

function put(req, res, next) {
  try {
    const { loggedUser } = req.session
    if (!loggedUser.is_admin)
      return res.render("admin/chefs/index", {
        error: "Somente administradores podem atualizar chefs",
      })

    const keys = Object.keys(req.body)
    for (key of keys) {
      if (req.body[key] == "") {
        return res.render("admin/chefs/edit", {
          error: "Por favor, preencha todos os campos!",
          user: req.body,
        })
      }
    }

    if (!req.files) {
      return res.render("admin/chefs/edit", {
        error: "Por favor, envie uma imagem de avatar!",
      })
    }

    next()
  } catch (err) {
    console.error(err)
  }
}

async function del(req, res, next) {
  const { loggedUser } = req.session

  let chefs = await Chef.findAll()
  chefsPromise = chefs.map(async (chef) => ({
    ...chef,
    avatar_url: await Chef.getAvatar(chef.id),
  }))
  chefs = await Promise.all(chefsPromise)

  const chefsListing = chefs.map((chef) => ({
    ...chef,
    avatar_url: `${req.protocol}://${req.headers.host}${chef.avatar_url.replace(
      "public",
      ""
    )}`,
  }))

  if (!loggedUser.is_admin)
    return res.render("admin/chefs/index", {
      error: "Somente administradores podem apagar chefs!",
      chefs: chefsListing,
      loggedUser,
    })

  const chefId = req.params.chef_id

  recipes = await Chef.getRecipes(chefId)

  if (recipes.length > 0)
    return res.render("admin/chefs/index", {
      error:
        "O Chef não pôde ser apagado! Apague todas as receitas de um chefe antes de apagá-lo.",
      chefs: chefsListing,
      loggedUser,
    })

  next()
}

module.exports = {
  post,
  manage,
  put,
  del,
}
