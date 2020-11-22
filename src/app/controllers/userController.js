const User = require("../models/User")
const { hash } = require("bcryptjs")
const generatePassword = require("../../utils/generatePassword")
const mailer = require("../../utils/mailer")

module.exports = {
  registerForm(req, res) {
    return res.render("admin/users/create")
  },

  async index(req, res) {
    const { loggedUser } = req.session
    try {
      users = await User.findAll()
      const data = { loggedUser, users }
      return res.render("admin/users/index", data)
    } catch (err) {
      console.error(err)
      return res.render("admin/session/login", {
        error:
          "Eita! Tivemos um probleminha. Refaça o login e tente novamente!",
      })
    }
  },

  async post(req, res) {
    try {
      const password = generatePassword.generate()
      mailer.sendMail({
        to: req.body.email,
        from: "no-reply@foodfy.com",
        subject: "Sua senha do Foodfy",
        html: `
          <h2>Sua senha é:</h2>
          <p>${password}</p>
        `,
      })
      req.body.password = await hash(password, 8)

      await User.create(req.body)
      return res.redirect("/admin/usuarios?status=success&from=create")
    } catch (err) {
      console.error(err)
    }
  },

  async edit(req, res) {
    const { loggedUser } = req.session
    const { id } = req.params

    const user = await User.findOne({ where: { id } })

    return res.render("admin/users/edit", { user, loggedUser })
  },

  async put(req, res) {
    try {
      await User.update(req.body.id, req.body)
      return res.redirect("/admin/usuarios?status=success&from=update")
    } catch (err) {
      console.error(err)
    }
  },

  async delete(req, res) {
    const { id } = req.params
    try {
      await User.delete(id)
      return res.redirect("/admin/usuarios?status=success&from=delete")
    } catch (err) {
      console.error(err)
    }
  },
}
