const crypto = require("crypto")
const User = require("../models/User")
const mailer = require("../../utils/mailer")
const { hash } = require("bcryptjs")

module.exports = {
  loginForm(req, res) {
    try {
      const { loggedUser } = req.session
      if (!loggedUser) return res.render("session/login")

      return res.redirect("/admin")
    } catch (err) {
      console.error(err)
    }
  },

  login(req, res) {
    try {
      req.session.loggedUser = req.user
      return res.redirect("/admin")
    } catch (err) {
      console.error(err)
    }
  },

  logout(req, res) {
    try {
      req.session.destroy()
      return res.render("site/home", {
        success: "Logout realizado com sucesso!",
      })
    } catch (err) {
      console.error(err)
    }
  },

  forgotForm(req, res) {
    return res.render("session/recover-password")
  },

  async forgot(req, res) {
    try {
      const { email } = req.body
      const token = crypto.randomBytes(20).toString("hex")

      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.setResetToken({
        userId: req.userId,
        token,
        expiration: now,
      })

      await mailer.sendMail({
        to: email,
        from: "no-reply@foodfy.com.br",
        subject: "Recuperação de senha",
        html: `
          <h2>Não se preocupe, clique no link abaixo para recuperar sua senha</h2>
          <a href="http://localhost:3000/nova-senha?${token}" target="_blank">
            RECUPERAR SENHA
          </a>
        `,
      })

      return res.render("session/recover-password", {
        success: "Verifique seu email para recuperar sua senha!",
      })
    } catch (err) {
      console.log(err)
      return res.render("session/login", {
        error:
          "Eita! Parece que alguma coisa não está certa com nosso serviço... tente novamente mais tarde :/",
      })
    }
  },

  resetForm(req, res) {
    return res.render("session/reset-password", { token: req.query.token })
  },

  async reset(req, res) {
    try {
      const { user } = req
      const { password } = req.body
      const newPassword = await hash(password, 8)

      await User.updatePassword({
        userId: user.id,
        password: newPassword,
      })

      return res.render("session/login", {
        success: "Senha alterada com sucesso!",
      })
    } catch (err) {
      console.error(err)
      return res.render("session/login", {
        error:
          "Eita! Tivemos um problema ao alterar sua senha, tente novamente mais tarde :/",
      })
    }
  },
}
