const crypto = require('crypto')
const User = require('../models/User')
const mailer = require('../../utils/mailer')
const { hash } = require('bcryptjs')

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
  },

  forgotForm(req, res) {
    return res.render('session/recover-password')
  },

  async forgot(req, res) {
    try {
      const { email } = req.body
      const token = crypto.randomBytes(20).toString('hex')

      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.setResetToken({
        userId: req.userId,
        token,
        expiration: now
      })

      await mailer.sendMail({
        to: email,
        from: 'no-reply@foodfy.com.br',
        subject: 'Recuperação de senha',
        html: `
          <h2>Não se preocupe, clique no link abaixo para recuperar sua senha</h2>
          <a href="http://localhost:3000/nova-senha?${token}" target="_blank">
            RECUPERAR SENHA
          </a>
        `
      })

      return res.render('session/recover-password', {
        success: 'Verifique seu email para recuperar sua senha!'
      })
    
    } catch (err) {
      console.log(err)

    }
  },

  resetForm(req, res) {
    return res.render('session/reset-password', {token: req.query.token})
  },

  async reset(req, res) {
    const { user } = req
    const { password } = req.body
    const newPassword = await hash(password, 8)

    await User.updatePassword({
      userId: user.id,
      password: newPassword
    })

    return res.redirect('/login')
  }
}