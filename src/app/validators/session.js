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

async function checkIfUserIsLogged (req, res, next) {
  if(!req.session.loggedUser) {
    return res.redirect('/login')
  }

  next()
}

async function forgot(req, res, next) {
  try {
    const { email } = req.body

    const userExists = await User.checkIfUserExists(email)
    if(!userExists) return res.send('Email não cadastrado!')

    const user = await User.get({
      condition: 'email',
      value: email
    })
  
    req.userId = user.id

    next()
  } catch (err) {
    console.error(err)
    return res.send('Hmmm... Parece que estamos com algum problema. Tente novamente mais tarde')
  }
}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body

  const userExists = await User.checkIfUserExists(email)
  if(!userExists) return res.send('Email não cadastrado!')
  if(password != passwordRepeat) return res.send('As senhas não conferem')

  const user = await User.get({
    condition: 'email',
    value: email
  })

  if(token != user.token) return res.send('Token inválido! Solicite uma nova recuperação de senha')
  let now = new Date()
  now = now.setHours(now.getHours())
  if(now > user.reset_token_expires) return res.send('Token expirado! Solicite uma nova recuperação de senha')

  req.user = user

  next()

}

module.exports = {
  login,
  checkIfUserIsLogged,
  forgot,
  reset
}