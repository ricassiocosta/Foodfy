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
      typeof data.ingredients === "string" ? [data.ingredients] : data.ingredients,
      typeof data.preparation === "string" ? [data.preparation] : data.preparation,
      data.information,
      date(Date.now()).ISO
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `DATABASE error! ${err}`

      return callback(results.rows[0])
    })
  },

  all(callback) {
    db.query(`
      SELECT recipes.*, chefs.name AS author
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY recipes.title
      `, (err, results) => {
      if(err) throw `DATABASE error! ${err}`
      return callback(results.rows)
    })
  },

  show(recipeID, callback) {
    db.query(`
      SELECT recipes.*, chefs.name AS author
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
      `, 
      [recipeID], (err, results) => {
      if(err) throw `DATABASE error! ${err}`
      return callback(results.rows[0])
    })
  },

  find(recipeID, callback) {
    db.query(`SELECT * FROM recipes WHERE recipes.id = $1`, [recipeID], (err, results) => {
      if(err) throw `DATABASE error! ${err}`
      return callback(results.rows[0])
    })
  },

  mostAccessed(callback) {
    db.query(`
      SELECT recipes.*, chefs.name AS author
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY recipes.id 
      LIMIT(6)
      `, 
      (err, results) => {
      if(err) throw `DATABASE error! ${err}`
      return callback(results.rows)
    })
  },

  update(data, callback) {
    const query = `
      UPDATE recipes SET
        title=($1),
        image=($2),
        chef_id=($3),
        ingredients=($4),
        preparation=($5),
        information=($6)
      WHERE
        id = $7
    `
    const values = [
      data.title,
      data.image,
      data.chef,
      data.ingredients.length > 1 ? data.ingredients : [data.ingredients],
      data.preparation.length > 1 ? data.preparation : [data.preparation],
      data.information,
      data.id
    ]

    db.query(query, values, (err) => {
      if(err) throw `DATABASE error! ${err}`
      return callback()
    })
  },

  delete(recipeID, callback) {
    db.query(`DELETE FROM recipes WHERE id = $1`, [recipeID], (err) => {
      if(err) throw `DATABASE error! ${err}`
      return callback()
    })
  }
}