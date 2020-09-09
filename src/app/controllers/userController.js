const User = require('../models/User')

module.exports = {
  create(req, res) {
    return res.render('admin/users/create')
  },

  index(req, res) {
    return res.render('admin/users/index')
  },

  async post(req, res) {
    try {
      const id = await User.create(req.body)
      req.session.userId = id
      return res.redirect('/admin/usuarios')
    } catch (err) {
      console.error(err)
    }
  }
}