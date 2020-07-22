const Chef = require('../models/Chef')

module.exports = {
 
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
      return res.render('admin/chefs/index', { chefs })
    }).catch((err) => {
      throw new Error(err)
    })
  },

  create(req, res) {
    return res.render('admin/chefs/create')
  },

  show(req, res) {
    const chefID = req.params.chef_id
    Chef.show(chefID)
    .then((results) => {
      const chefData = {}
      chefData.id = results.rows[0].id
      chefData.name = results.rows[0].name
      chefData.avatar_url = results.rows[0].avatar_url
      chefData.recipes_amount = results.rows[0].recipesamount

      chefData.recipes = []
      results.rows.map(chef => {{
        let recipe = {}
        recipe.id = chef.recipeid
        recipe.image = chef.image
        recipe.title = chef.title
        chefData.recipes.push(recipe)
      }})

      return res.render('admin/chefs/show', { chefData })
    }).catch((err) => {
      throw new Error(err)
    })
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

  async post(req, res) {
    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }

    await Chef.create(req.body)
    .then((results) => {
      const chef = results.rows[0]
      return res.redirect(`/admin/chefs/${chef.id}`)
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

  delete(req, res) {
    const chefID = req.params.chef_id

    Chef.show(chefID)
    .then((results) => {
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
    }).catch((err) => {
      throw new Error(err)
    })
  }
}