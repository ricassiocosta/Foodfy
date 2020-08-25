const File = require('../models/File')

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

  next()
}

module.exports = {
  post,
  put
}