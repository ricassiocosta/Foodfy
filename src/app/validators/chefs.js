const Chef = require('../models/Chef')

function post(req, res, next) {
  try {
    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }
  
    if(!req.files) {
      return res.send('Por favor, envie uma imagem de avatar!')
    }
    
    next()
  } catch (err) {
    console.error(err)
  }
}

function put(req, res, next) {
  try {
    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
      }
    }
  
    if(!req.files) {
      return res.send('Por favor, envie uma imagem de avatar!')
    }
    
    next()
  } catch (err) {
    console.error(err)
  }
}

async function del(req, res, next) {
  const chefID = req.params.chef_id

  let results = await Chef.show(chefID)
  const recipesAmount = results.rows[0].recipesamount

  if(recipesAmount > 0) {
    return res.send('[ERROR] O Chef não pôde ser deletado! Delete todas as receitas de um chefe antes de deletá-lo.')
  } else {
    next()
  }
}

module.exports = {
  post,
  put,
  del
}