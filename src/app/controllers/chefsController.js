const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
  create(req, res) {
    return res.render('admin/chefs/create')
  },

  post(req, res) {
    Chef.create(req.body)
    .then((results) => {
      const chef = results.rows[0]
      File.createChefAvatar(req.files[0], chef.id)
      return res.redirect(`/admin/chefs/${chef.id}?status=success&from=create`)
    }).catch((err) => {
      throw new Error(err)
    })
  },
 
  listing(req, res) {
    Chef.all()
    .then((results) => {
      const chefs = results.rows
      const chefsListing = chefs.map(chef => ({
        ...chef,
        avatar_url:`${req.protocol}://${req.headers.host}${chef.avatar_url.replace("public", "")}`
      }))
      return res.render('site/chefs', { chefs: chefsListing })
    }).catch((err) => {
      throw new Error(err)
    })
  },

  index(req, res) {
    const { loggedUser } = req.session
    Chef.all()
    .then((results) => {
      const chefs = results.rows
      const chefsListing = chefs.map(chef => ({
        ...chef,
        avatar_url:`${req.protocol}://${req.headers.host}${chef.avatar_url.replace("public", "")}`
      }))

      const data = { chefs: chefsListing, loggedUser }

      const { status, from } = req.query
      if(status == 'success' && from == 'delete') {
        data.success = 'Chef apagado com sucesso!'
      }

      return res.render('admin/chefs/index', data)
    }).catch((err) => {
      throw new Error(err)
    })
  },

  async show(req, res) {
    const { loggedUser } = req.session
    const chefId = req.params.chef_id
    
    let results = await Chef.show(chefId)
    const chefInfo = results.rows[0]
    const chef = {
      ...chefInfo,
      avatar_url: `${req.protocol}://${req.headers.host}${chefInfo.avatar_url.replace("public", "")}`
    }
    
    results = await Chef.getRecipes(chefId)
    const recipes = results.rows
    File.translateImagesURL(req, recipes)

    const data = { chef, recipes, loggedUser }
    
    const { status, from } = req.query
    if(status == 'success' && from == 'update') {
      data.success = 'Atualização realizada com sucesso!'
    } else if(status == 'success' && from == 'create') {
      data.success = 'Chef criado com sucesso!'
    } else if(status != null) {
      data.error = 'Erro ao tentar atualizar, tente novamente!'
    }

    return res.render('admin/chefs/show', data)
  },

  edit(req, res) {
    const chefId = req.params.chef_id
    Chef.show(chefId)
    .then((results) => {
      const chefInfo = results.rows[0]
      const chef = {
        ...chefInfo,
        avatar_url: `${req.protocol}://${req.headers.host}${chefInfo.avatar_url.replace("public", "")}`
      }
      return res.render('admin/chefs/edit', { chef })
    }).catch((err) => {
      throw new Error(err)
    })
  },

  put(req, res) {
    Chef.update(req.body, req.files[0])
    .then(() => {
      return res.redirect(`/admin/chefs/${req.body.id}?status=success&from=update`)
    }).catch((err) => {
      throw new Error(err)
    })
  },

  async delete(req, res) {
    const chefId = req.params.chef_id
    Chef.delete(chefId)
    .then(() => {
      return res.redirect('/admin/chefs?status=success&from=delete')
    }).catch((err) => {
      throw new Error(err)
    })
  }
}