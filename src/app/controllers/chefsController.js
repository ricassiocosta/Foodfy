const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

module.exports = {
 
  index(req, res) {
    Chef.all((chefs) => {
      return res.render('admin/chefs', {
        chefs
      })
    })
  },

  create(req, res) {
    return res.render('admin/chef-creation')
  },

  show(req, res) {
    const chefID = req.params.chef_id
    Chef.show(chefID, (chef) => {
      Recipe.recipesByAuthor(chef.id, (recipes) => {
        return res.render('admin/chef-detail', { chef, recipes })
      })
    })
  },

  edit(req, res) {
    const chefID = req.params.chef_id
    Chef.show(chefID, (chef) => {
      return res.render('admin/chef-edit', { chef })
    })
  },

  post(req, res) {
    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }

    Chef.create(req.body, (chef) => {
      return res.redirect(`chefs/${chef.id}`)
    })
  },

  put(req, res) {
    Chef.update(req.body, () => {
      return res.redirect(`/admin/chefs/${req.body.id}`)
    })
  },

  delete(req, res) {

  }

}