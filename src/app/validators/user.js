const { compare } = require('bcryptjs')
const User = require('../models/User')

async function create(req, res, next) {
  const { loggedUser } = req.session

  if(!loggedUser.is_admin) {
    return res.send('Somente administradores podem criar novos usuários!')
  }

  const userExists = await User.checkIfUserExists(req.body.email)
  if(userExists) {
    return res.send('Já existe um usuário cadastrado com o email informado!')
  }

  next()
}

async function put(req, res, next) {
  const { id, email, password } = req.body
  const { loggedUser } = req.session
  
  if((!loggedUser.is_admin) && loggedUser.id != id)
    return res.send('Somente administradores podem atualizar o cadastrado de outros usuários!')

  const passed = await compare(password, loggedUser.password)
  if(!passed) 
    return res.send('Senha incorreta!')

  const user = await User.get({
    condition: 'id',
    value: id
  })

  const userExists = await User.checkIfUserExists(email)
  if(userExists && email != user.email) {
    return res.send('Já existe um usuário cadastrado com o email informado!')
  }

  if(loggedUser.is_admin && loggedUser.id == user.id && loggedUser.is_admin != user.is_admin) {
    return res.send('Não é possível deixar de ser admin')
  }

  if(user.is_admin) {
    req.body.is_admin = true
  }

  next()
}

async function del(req, res, next) {
  const { loggedUser } = req.session
  const { id } = req.params

  if(!loggedUser.is_admin)
    return res.send('Somente administradores podem apagar usuários!')
  
  if(loggedUser.id == id)
    return res.send('Você não pode apagar sua própria conta!')
  
  next()
}

module.exports = {
  create,
  put,
  del
}