module.exports = {
  loginForm(req, res) {
    const { loggedUser } = req.session
    if(!loggedUser)
      return res.render('session/login')
    
    return res.redirect('/admin')
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