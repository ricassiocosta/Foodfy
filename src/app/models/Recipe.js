const db = require('../../config/database')
const { date } = require('../../utils/date')

module.exports = {
  create(data, callback) {
    const query = `
      INSERT INTO recipes (
        chef_id,
        image,
        title,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ( $1, $2, $3, $4, $5, $6, $7 )
      RETURNING ID
    `
    const values = [
      data.chef,
      data.image,
      data.title,
      [data.ingredients],
      [data.preparation],
      data.information,
      date(Date.now()).ISO
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `DATABASE error! ${err}`

      return callback(results.rows[0])
    })
  }
}