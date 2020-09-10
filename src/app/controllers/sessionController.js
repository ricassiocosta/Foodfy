module.exports = {
  loginForm(req, res) {
    return res.render('session/login')
  },

  login(req, res) {
    req.session.loggedUser = req.user
    return res.redirect('/admin')
  },

  logout(req, res) {
    req.session.destroy()
    return res.redirect('/')
  }
}