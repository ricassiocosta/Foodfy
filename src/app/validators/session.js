const { compare } = require('bcryptjs')
const User = require('../models/User')

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const userExists = await User.checkIfUserExists(email)
    if(!userExists) return res.send('Email não cadastrado!')

    const user = await User.get({
      condition: 'email',
      value: email
    })

    const passed = await compare(password, user.password)
    if(!passed) return res.send('Senha incorreta!')

    req.user = user
    next()
  } catch (err) {
    console.error(err)
    return res.send('Hmmm... Parece que estamos com algum problema. Tente novamente mais tarde')
  }
}

function checkIfUserIsLogged (req, res, next) {
  if(!req.session.loggedUser) {
    return res.redirect('/login')
  }

  next()
}

module.exports = {
  login,
  checkIfUserIsLogged
}