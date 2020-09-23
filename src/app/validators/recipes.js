const File = require('../models/File')
const Recipe = require('../models/Recipe')

function index(req, res, next) {
  req.is_admin = true
  next()
}

function show(req, res, next) {
  req.is_admin = true
  next()
}

function post(req, res, next) {
  const keys = Object.keys(req.body)
  for(key of keys) {
    if(req.body[key] == "") {
      return res.render('admin/recipes/create', {
        recipe: req.body,
        error: 'Por favor, preencha todos os campos!'
      })
    }
  }

  if(!req.files) {
    return res.render('admin/recipes/create', {
      recipe: req.body,
      error: 'Por favor, envie uma imagem de avatar!'
    })
  }

  next()
}

async function edit(req, res, next) {
  const id = req.params.recipe_id
  const { loggedUser } = req.session

  let results = await Recipe.show(id)
  const recipe = results.rows[0]
  if(recipe.user_id != loggedUser.id && !loggedUser.is_admin)
    return res.render('admin/recipes/index', {
      error: 'Somente o usuário que criou esta receita pode editá-la!'
    })
  
  next()
}

async function put(req, res, next) {
  const { id } = req.body.id
  
  if(req.files && req.files.length != 0) {
    const newFilesPromise = req.files.map(file => File.createRecipeImages(file, id))
    await Promise.all(newFilesPromise)
  }

  if(req.body.removed_files) {
    const removedFiles = req.body.removed_files.split(",")
    const lastIndex = removedFiles.length - 1
    removedFiles.splice(lastIndex, 1)

    const removedFilesPromise = removedFiles.map(id => File.deleteFile(id))
    await Promise.all(removedFilesPromise)
  }

  next()
}

async function del(req, res, next) {
  const id = req.params.recipe_id
  const { loggedUser } = req.session

  let results = await Recipe.show(id)
  const recipe = results.rows[0]

  if(recipe.user_id != loggedUser.id && !loggedUser.is_admin)
    return res.render('admin/recipes/index', {
      error: 'Somente o usuário que criou esta receita pode apagá-la!'
    })
  
  next()
}

module.exports = {
  post,
  edit,
  put,
  index,
  show,
  del
}