const User = require('../models/User')

module.exports = {
  create(req, res) {
    return res.render('admin/users/create')
  },

  index(req, res) {
    const { loggedUser } = req.session
    try {
      User.getAllUsers()
      .then((results) => {
        const data = { loggedUser, users: results }

        const { status, from } = req.query
        if(status == 'success' && from == 'update') {
          data.success = 'Atualização realizada com sucesso!'
        } else if(status == 'success' && from == 'create') {
          data.success = 'Usuário criado com sucesso!'
        } else if(status == 'success' && from == 'delete') {
          data.success = 'Usuário apagado com sucesso!'
        } else if(status != null) {
          data.error = 'Erro ao tentar atualizar, tente novamente!'
        }

        return res.render('admin/users/index', data)
      })
      .catch((err) => {
        console.error(err)
      })
    } catch (err) {
      console.error(err)
      return res.render('admin/session/login', { error: 'Eita! Tivemos um probleminha. Refaça o login e tente novamente!' })
    }
  },

  async post(req, res) {
    try {
      await User.create(req.body)
      return res.redirect('/admin/usuarios?status=success&from=create')
    } catch (err) {
      console.error(err)
    }
  },

  async edit(req, res) {
    const { loggedUser } = req.session
    const { id } = req.params

    const user = await User.get({
      condition: 'id',
      value: id
    })

    return res.render('admin/users/edit', { user, loggedUser })
  },

  async put(req, res) {
    try {
      await User.update(req.body)
      return res.redirect('/admin/usuarios?status=success&from=update')
    } catch (err) {
      console.error(err)
    }
  },

  async delete(req, res) {
    const { id } = req.params
    try {
      await User.delete(id)
      return res.redirect('/admin/usuarios?status=success&from=delete')
    } catch (err) {
      console.error(err)
    }
  }
}