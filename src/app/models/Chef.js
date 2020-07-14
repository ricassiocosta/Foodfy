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
  },

  show(chefID, callback) {
    db.query(`
      SELECT chefs.*, (SELECT count(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS recipesAmount
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id
      `, 
    [chefID], (err, results) => {
      if(err) throw `DATABASE error! ${err}`
      return callback(results.rows[0])
    })
  },

  update(data, callback) {
    const query = `
      UPDATE chefs SET
        name=($1),
        avatar_url=($2)
      WHERE
        id = $3
    `
    const values = [
      data.name,
      data.avatar_url,
      data.id
    ]

    db.query(query, values, (err) => {
      if(err) throw `DATABASE error! ${err}`
      return callback()
    })
  },

  delete(chefID, callback) {
    db.query(`DELETE FROM chefs WHERE id = $1`, [chefID], (err) => {
      if(err) throw `DATABASE error! ${err}`
      return callback()
    })
  }
}