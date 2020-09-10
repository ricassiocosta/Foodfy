const { hash } = require('bcryptjs')
const db = require('../../config/database')
const generatePassword = require('../../utils/generatePassword')
const mailer = require('../../utils/mailer')

module.exports = {
  async create(data) {
    const password = generatePassword.generate()
    mailer.sendMail({
      to: data.email,
      from: 'no-reply@foodfy.com',
      subject: 'Sua senha do Foodfy',
      html: `
        <h2>Sua senha é:</h2>
        <p>${password}</p>
      `
    })

    const query = `
      INSERT INTO users (
        name,
        email,
        is_admin,
        password
      ) VALUES ( $1, $2, $3, $4)
    `

    const passwordHash = await hash(password, 8)

    const values = [
      data.name,
      data.email,
      data.is_admin,
      passwordHash
    ]

    const results = await db.query(query, values)
    return results.rows[0]
  },

  async update(data) {
    const query = `
      UPDATE users SET
        name = ($1),
        email = ($2),
        is_admin = ($3)
      WHERE id = $4
    `

    const values = [
      data.name,
      data.email,
      data.is_admin,
      data.id
    ]

    const results = await db.query(query, values)
    return results.rows[0]
  },

  async checkIfUserExists(email) {
    let results = await db.query(`SELECT id FROM users WHERE email = $1`, [email])
    if(results.rows[0]) {
      return true
    } else {
      return false
    }
  },

  async get(query) {
    let results = await db.query(`SELECT * FROM users WHERE ${query.condition} = $1`, [query.value])
    return results.rows[0]
  },

  async getAllUsers() {
    let results = await db.query(`SELECT * FROM users`)
    const userList = results.rows
    return userList
  },

  async delete(id) {
    return db.query(`
      DELETE FROM users WHERE id = $1
    `, [id])
  }
}