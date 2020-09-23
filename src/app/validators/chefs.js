const Chef = require('../models/Chef')

function post(req, res, next) {
  try {
    const { loggedUser } = req.session
    if(!loggedUser.is_admin) 
      return res.redirect('/admin', {
        error: 'Somente administradores podem criar novos chefs'
      })

    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") {
        return res.render('admin/chefs/create', {
          error: 'Por favor, preencha todos os campos!'
        })
      }
    }
  
    if(!req.files) {
      return res.render('admin/chefs/create', {
        error: 'Por favor, envie uma imagem de avatar!'
      })
    }
    
    next()
  } catch (err) {
    console.error(err)
  }
}

function manage(req, res, next) {
  const { loggedUser } = req.session
  if(!loggedUser.is_admin) 
    return res.render('admin/chefs/index', {
      error: 'Somente administradores podem atualizar chefs'
    })
  
  next()
}

function put(req, res, next) {
  try {
    const { loggedUser } = req.session
    if(!loggedUser.is_admin) 
      return res.render('admin/chefs/index', {
        error: 'Somente administradores podem atualizar chefs'
      })

    const keys = Object.keys(req.body)
    for(key of keys) {
      if(req.body[key] == "") {
        return res.render('admin/chefs/edit', {
          error: 'Por favor, preencha todos os campos!',
          user: req.body
        })
      }
    }
  
    if(!req.files) {
      return res.render('admin/chefs/edit', {
        error: 'Por favor, envie uma imagem de avatar!'
      })
    }
    
    next()
  } catch (err) {
    console.error(err)
  }
}

async function del(req, res, next) {
  const { loggedUser } = req.session
  if(!loggedUser.is_admin)
    return res.render('admin/chefs/index', {
      error: 'Somente administradores podem apagar chefs!'
    }) 

  const chefId = req.params.chef_id

  let results = await Chef.show(chefId)
  const recipesAmount = results.rows[0].recipes_amount

  if(recipesAmount > 0) 
    return res.render('admin/chefs/index', {
      error: 'O Chef não pôde ser deletado! Delete todas as receitas de um chefe antes de deletá-lo.'
    }) 
  
  next()
}

module.exports = {
  post,
  manage,
  put,
  del
}