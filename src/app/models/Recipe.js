const db = require('../../config/database')
const { date } = require('../../utils/date')

module.exports = {
  create(data, callback) {
    const query = `
      INSERT INTO recipes (
        image,
        title,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ( $1, $2, $3, $4, $5, $6 )
      RETURNING ID
    `
    const values = [
      data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).ISO
    ]
  }
}