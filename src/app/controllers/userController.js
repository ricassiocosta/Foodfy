const User = require('../models/User')

module.exports = {
  create(req, res) {
    return res.render('admin/users/create')
  },

  index(req, res) {
    const { loggedUser } = req.session
    console.log(loggedUser)
    try {
      User.getAllUsers()
      .then((results) => {
        return res.render('admin/users/index', { 
          logged_user: loggedUser, 
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
      const user = await User.create(req.body)
      req.session.loggedUser = user
      return res.redirect('/admin/usuarios')
    } catch (err) {
      console.error(err)
    }
  }
}