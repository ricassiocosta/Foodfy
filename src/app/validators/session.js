const { compare } = require("bcryptjs")
const User = require("../models/User")

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const userExists = await User.findOne({ where: { email } })
    if (!userExists)
      return res.render("session/login", {
        error: "Usuário não encontrado!",
      })

    const user = await User.findOne({ where: { email } })

    const passed = await compare(password, user.password)
    if (!passed)
      return res.render("session/login", {
        email,
        error: "Senha incorreta!",
      })

    req.user = user
    next()
  } catch (err) {
    console.error(err)
    return res.render("session/login", {
      email,
      error:
        "Hmmm... Parece que estamos com algum problema. Tente novamente mais tarde",
    })
  }
}

async function checkIfUserIsLogged(req, res, next) {
  if (!req.session.loggedUser) {
    return res.redirect("/login", {
      error: "Login expirado! Por favor, realize o login novamente.",
    })
  }

  next()
}

async function forgot(req, res, next) {
  try {
    const { email } = req.body

    const userExists = await User.findOne({ where: { email } })
    if (!userExists)
      return res.render("session/recover-password", {
        error: "Email não cadastrado!",
      })

    const user = await User.findOne({ where: { email } })

    req.userId = user.id

    next()
  } catch (err) {
    console.error(err)
    return res.render("session/recover-password", {
      email,
      error:
        "Hmmm... Parece que estamos com algum problema. Tente novamente mais tarde",
    })
  }
}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body

  const userExists = await User.findOne({ where: { email } })
  if (!userExists)
    return res.render("session/reset-password", {
      email,
      token,
      error: "Email não cadastrado!",
    })
  if (password != passwordRepeat)
    return res.render("session/reset-password", {
      email,
      token,
      error: "As senhas não conferem!",
    })

  const user = await User.findOne({ where: { email } })

  if (token != user.token)
    return res.render("session/reset-password", {
      email,
      error: "Token inválido! Solicite uma nova recuperação de senha",
    })
  let now = new Date()
  now = now.setHours(now.getHours())
  if (now > user.reset_token_expires)
    return res.render("session/reset-password", {
      email,
      error: "Token expirado! Solicite uma nova recuperação de senha",
    })

  req.user = user

  next()
}

module.exports = {
  login,
  checkIfUserIsLogged,
  forgot,
  reset,
}
