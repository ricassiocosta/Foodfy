const User = require('../models/User')

async function create(req, res, next) {
  const userExists = await User.checkIfUserExists(req.body.email)
  if(userExists) {
    return res.send('Já existe um usuário cadastrado com o email informado!')
  } else {
    next()
  }
}

module.exports = {
  create
}