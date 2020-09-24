const { compare } = require('bcryptjs')
const User = require('../models/User')

async function create(req, res, next) {
  const { loggedUser } = req.session

  if(!loggedUser.is_admin) {
    return res.render('admin/users/index', {
      error: 'Somente administradores podem criar novos usuários!'
    }) 
  }

  const userExists = await User.checkIfUserExists(req.body.email)
  if(userExists) {
    return res.render('admin/users/index', {
      error: 'Já existe um usuário cadastrado com o email informado!'
    }) 
  }

  next()
}

async function put(req, res, next) {
  const { id, email, password, name } = req.body
  const { loggedUser } = req.session

  const users = await User.getAllUsers()
  
  if((!loggedUser.is_admin) && loggedUser.id != id)
    return res.render('admin/users/index', {
      error: 'Somente administradores podem atualizar o cadastrado de outros usuários!',
      users,
      loggedUser
    }) 

  const passed = await compare(password, loggedUser.password)
  if(!passed) 
    return res.render('admin/users/edit', {
      error: 'Senha incorreta!',
      email,
      name
    }) 

  const user = await User.get({
    condition: 'id',
    value: id
  })

  const userExists = await User.checkIfUserExists(email)
  if(userExists && email != user.email) {
    return res.render('admin/users/index', {
      error: 'Já existe um usuário cadastrado com o email informado!',
      users,
      loggedUser
    }) 
  }

  if(loggedUser.is_admin && loggedUser.id == user.id && loggedUser.is_admin != user.is_admin) {
    return res.render('admin/users/index', {
      error: 'Não é possível deixar de ser admin',
      users,
      loggedUser
    }) 
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
    return res.render('admin/users/index', {
      error: 'Somente administradores podem apagar usuários!'
    }) 
  
  if(loggedUser.id == id)
    return res.render('admin/users/index', {
      error: 'Você não pode apagar sua própria conta!'
    }) 
  
  next()
}

module.exports = {
  create,
  put,
  del
}