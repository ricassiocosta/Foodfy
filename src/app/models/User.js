const db = require("../../config/database")
const Base = require("./Base")

Base.init({ table: "users" })

module.exports = {
  ...Base,
  async setResetToken(data) {
    const query = `
      UPDATE users SET
        reset_token = ($1),
        reset_token_expires = ($2)
      WHERE id = $3
    `

    const values = [data.token, data.expiration, data.userId]

    const results = await db.query(query, values)
    return results.rows[0]
  },

  async updatePassword(data) {
    const query = `
      UPDATE users SET
        password = ($1),
        reset_token = ($2),
        reset_token_expires = ($3)
      WHERE id = $4
    `

    const values = [data.password, "", "", data.userId]

    const results = await db.query(query, values)
    return results.rows[0]
  },
}
