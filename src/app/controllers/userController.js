const { index } = require("./recipesController")

module.exports = {
  create(req, res) {
    return res.render('admin/users/create')
  },

  index(req, res) {
    return res.render('admin/users/index')
  }
}