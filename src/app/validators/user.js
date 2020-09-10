const User = require('../models/User')

async function create(req, res, next) {
  const userExists = await User.checkIfUserExists(req.body.email)
  if(userExists) {
    return res.send('Já existe um usuário cadastrado com o email informado!')
  }

  next()
}

async function edit(req, res, next) {
  const { id, email } = req.body
  const { loggedUser } = req.session

  if((!loggedUser.is_admin) && loggedUser.id != id) {
    return res.send('Somente administradores podem atualizar o cadastrado de outros usuários!')
  }

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

  next()
}

module.exports = {
  create,
  edit
}