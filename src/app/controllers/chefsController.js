const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

module.exports = {
 
  listing(req, res) {
    Chef.all((chefs) => {
      return res.render('site/chefs', { chefs })
    })
  },

  index(req, res) {
    Chef.all((chefs) => {
      return res.render('admin/chefs/index', {
        chefs
      })
    })
  },

  create(req, res) {
    return res.render('admin/chefs/create')
  },

  show(req, res) {
    const chefID = req.params.chef_id
    Chef.show(chefID, (chef) => {
      Recipe.recipesByAuthor(chef.id, (recipes) => {
        return res.render('admin/chefs/show', { chef, recipes })
      })
    })
  },

  edit(req, res) {
    const chefID = req.params.chef_id
    Chef.show(chefID, (chef) => {
      return res.render('admin/chefs/edit', { chef })
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
    const chefID = req.params.chef_id

    Recipe.recipesByAuthor(chefID, (recipes) => {
      if(recipes.length > 0) {
        return res.send('[ERROR] O Chef não pôde ser deletado! Delete todas as receitas de um chefe antes de deletá-lo.')
      } else {
        Chef.delete(chefID, () => {
          return res.redirect('/admin/index')
        })
      }
    })
  }
}