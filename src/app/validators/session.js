const { compare } = require('bcryptjs')
const User = require('../models/User')

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const userExists = await User.checkIfUserExists(email)
    if(!userExists) return res.send('Email não cadastrado!')

    const user = await User.get(email)

    const passed = await compare(password, user.password)
    if(!passed) return res.send('Senha incorreta!')

    req.user = user
    next()
  } catch (err) {
    console.error(err)
    return res.send('Hmmm... Parece que estamos com algum problema. Tente novamente mais tarde')
  }
}

module.exports = {
  login
}