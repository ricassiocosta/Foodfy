const db = require('../../config/database')
const { date } = require('../../utils/date')

module.exports = {
  create(data) {
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

    return db.query(query, values)
  },

  all() {
    return db.query(`
    SELECT chefs.*, (SELECT count(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS recipesamount
    FROM chefs 
    ORDER BY chefs.name
    `)
  },

  listing() {
    return db.query(`
    SELECT chefs.id, chefs.name FROM chefs
    `)
  },

  show(chefID) {
    return db.query(`
      SELECT chefs.*, (SELECT count(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS recipesAmount,
      recipes.id AS recipeid, recipes.image, recipes.title
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id, recipes.id
      `, [chefID])
  },

  update(data) {
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

    return db.query(query, values)
  },

  delete(chefID) {
    return db.query(`DELETE FROM chefs WHERE id = $1`, [chefID])
  }
}