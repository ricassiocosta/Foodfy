const Chef = require('../models/Chef')

exports.index = (req, res) => {
  return res.render('admin/chefs')
}

exports.create = (req, res) => {
  return res.render('admin/chef-creation')
}

exports.post = (req, res) => {
  const keys = Object.keys(req.body)
  for(key of keys) {
    if(req.body[key] == "") {
      return res.send('Por favor, preencha todos os campos!')
    }
  }

  Chef.create(req.body, (chef) => {
    return res.redirect(`chefs/${chef.id}`)
  })
}