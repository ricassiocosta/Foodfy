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
      return res.send('Por favor, preencha todos os campos!')
    }
  }

  if(!req.files) {
    return res.send('Por favor, envie ao menos uma imagem!')
  }

  next()
}

async function put(req, res, next) {
  const { loggedUser } = req.session
  if(req.files && req.files.length != 0) {
    const newFilesPromise = req.files.map(file => File.createRecipeImages(file, req.body.id))
    await Promise.all(newFilesPromise)
  }

  if(req.body.removed_files) {
    const removedFiles = req.body.removed_files.split(",")
    const lastIndex = removedFiles.length - 1
    removedFiles.splice(lastIndex, 1)

    const removedFilesPromise = removedFiles.map(id => File.deleteFile(id))
    await Promise.all(removedFilesPromise)
  }

  let results = await Recipe.show(req.body.id)
  const recipe = results.rows[0]
  if(recipe.user_id != loggedUser.id && !loggedUser.is_admin)
    return res.send('Somente o usuário que criou esta receita pode editá-la!')

  next()
}

async function del(req, res, next) {
  const id = req.params.recipe_id
  const { loggedUser } = req.session

  let results = await Recipe.show(id)
  const recipe = results.rows[0]

  if(recipe.user_id != loggedUser.id && !loggedUser.is_admin)
    return res.send('Somente o usuário que criou esta receita pode apagá-la!')
  
  next()
}

module.exports = {
  post,
  put,
  index,
  show,
  del
}