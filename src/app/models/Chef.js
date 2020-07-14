const db = require('../../config/database')
const { date } = require('../../utils/date')

module.exports = {
  create(data, callback) {
    const query = `
      INSERT INTO chefs (
        name,
        avatar_url,
        created_at
      ) VALUES ( $1, $2, $3 )
      RETURNING ID
    `
    const values = [
      data.name,
      data.avatar_url,
      date(Date.now()).ISO
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `DATABASE error! ${err}`

      return callback(results.rows[0])
    })
  },

  all(callback) {
    db.query(`SELECT * FROM chefs ORDER BY chefs.name`, (err, results) => {
      if(err) throw `DATABASE error! ${err}`
      return callback(results.rows)
    })
  }
}