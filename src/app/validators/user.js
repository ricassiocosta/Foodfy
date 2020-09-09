const User = require('../models/User')

function create(req, res, next) {
  if(User.checkIfUserExists(req.email)) {
    return res.send('Já existe um usuário cadastrado com o email informado!')
  } else {
    next()
  }
}

module.exports = {
  create
}