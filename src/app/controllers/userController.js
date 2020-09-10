const User = require('../models/User')

module.exports = {
  create(req, res) {
    return res.render('admin/users/create')
  },

  index(req, res) {
    const { loggedUser } = req.session
    try {
      User.getAllUsers()
      .then((results) => {
        return res.render('admin/users/index', { 
          loggedUser, 
          users: results 
        })
      })
      .catch((err) => {
        console.error(err)
      })
    } catch (err) {
      console.error(err)
      return res.render('admin/session/login', { error: 'Eita! Tivemos um probleminha. Refaça o login e tente novamente!' })
    }
  },

  async post(req, res) {
    try {
      await User.create(req.body)
      return res.redirect('/admin/usuarios')
    } catch (err) {
      console.error(err)
    }
  },

  async edit(req, res) {
    const { loggedUser } = req.session
    const { id } = req.params

    const user = await User.get({
      condition: 'id',
      value: id
    })

    return res.render('admin/users/edit', { user, loggedUser })
  },

  async put(req, res) {
    try {
      await User.update(req.body)
      return res.redirect('/admin/usuarios')
    } catch (err) {
      console.error(err)
    }
  }
}