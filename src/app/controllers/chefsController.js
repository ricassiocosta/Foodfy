const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
  create(req, res) {
    return res.render('admin/chefs/create')
  },

  post(req, res) {
    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }

    if(req.files.length == 0) {
      return res.send('Por favor, envie uma imagem de avatar!')
    }

    Chef.create(req.body)
    .then((results) => {
      const chef = results.rows[0]
      File.createChefAvatar(req.files[0], chef.id)
      return res.redirect(`/admin/chefs/${chef.id}`)
    }).catch((err) => {
      throw new Error(err)
    })
  },
 
  listing(req, res) {
    Chef.all()
    .then((results) => {
      const chefs = results.rows
      return res.render('site/chefs', { chefs })
    }).catch((err) => {
      throw new Error(err)
    })
  },

  index(req, res) {
    Chef.all()
    .then((results) => {
      const chefs = results.rows
      const chefsListing = chefs.map(chef => ({
        ...chef,
        avatar_url:`${req.protocol}://${req.headers.host}${chef.avatar_url.replace("public", "")}`
      }))
      return res.render('admin/chefs/index', { chefs: chefsListing })
    }).catch((err) => {
      throw new Error(err)
    })
  },

  async show(req, res) {
    const chefID = req.params.chef_id
  
    let results = await Chef.show(chefID)
    const chefInfo = results.rows[0]
    const chef = {
      ...chefInfo,
      avatar_url: `${req.protocol}://${req.headers.host}${chefInfo.avatar_url.replace("public", "")}`
    }

    results = await Chef.getRecipes(chefID)
    const recipes = results.rows
    
    File.translateImagesURL(req, recipes)
    return res.render('admin/chefs/show', { chef, recipes })
  },

  edit(req, res) {
    const chefID = req.params.chef_id
    Chef.show(chefID)
    .then((results) => {
      const chef = results.rows[0]
      return res.render('admin/chefs/edit', { chef })
    }).catch((err) => {
      throw new Error(err)
    })
  },

  put(req, res) {
    Chef.update(req.body)
    .then(() => {
      return res.redirect(`/admin/chefs/${req.body.id}`)
    }).catch((err) => {
      throw new Error(err)
    })
  },

  async delete(req, res) {
    const chefID = req.params.chef_id

    let results = await Chef.show(chefID)
    const recipesAmount = results.rows[0].recipesamount

    if(recipesAmount > 0) {
      return res.send('[ERROR] O Chef não pôde ser deletado! Delete todas as receitas de um chefe antes de deletá-lo.')
    } else {
      Chef.delete(chefID)
      .then(() => {
        return res.redirect('/admin/chefs')
      }).catch((err) => {
        throw new Error(err)
      })
    }
  }
}