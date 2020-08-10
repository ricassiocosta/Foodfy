const db = require('../../config/database')
const { date } = require('../../utils/date')

module.exports = {
  create(data) {
    const query = `
      INSERT INTO chefs (
        name,
        created_at
      ) VALUES ( $1, $2 )
      RETURNING ID
    `
    const values = [
      data.name,
      date(Date.now()).ISO
    ]

    return db.query(query, values)
  },

  all() {
    return db.query(`
    SELECT chefs.*, (SELECT count(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS recipesamount, files.path AS avatar_url
    FROM chefs 
    LEFT JOIN files ON (chefs.file_id = files.id)
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
      SELECT chefs.*, 
        (SELECT count(*) 
          FROM recipes 
          WHERE recipes.chef_id = chefs.id
        ) AS recipes_amount,
        files.path AS avatar_url
      FROM chefs
      LEFT JOIN files ON (chefs.file_id = files.id)
      WHERE chefs.id = $1
      `, [chefID])
  },

  getRecipes(chefID) {
    return db.query(`
      SELECT recipes.id, recipes.title, files.path AS image
      FROM recipes
      LEFT JOIN recipe_files ON(recipes.id = recipe_files.recipe_id)
      LEFT JOIN files ON(recipe_files.file_id = files.id)
      WHERE recipes.chef_id = $1
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