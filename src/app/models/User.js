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
      RETURNING ID
    `

    const passwordHash = await hash(password, 8)

    const values = [
      data.name,
      data.email,
      data.is_admin,
      passwordHash
    ]

    const results = await db.query(query, values)
    return results.rows[0].id
  }
}