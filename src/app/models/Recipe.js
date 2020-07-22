const db = require('../../config/database')
const { date } = require('../../utils/date')

module.exports = {
  create(data) {
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

    return db.query(query, values)
  },

  all() {
    return db.query(`
      SELECT recipes.*, chefs.name AS author
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY recipes.title
      `)
  },

  show(recipeID) {
    return db.query(`
      SELECT recipes.*, chefs.name AS author
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
      `, 
    [recipeID])
  },

  mostAccessed() {
    return db.query(`
      SELECT recipes.*, chefs.name AS author
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY recipes.id 
      LIMIT(6)
      `)
  },

  update(data) {
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

    return db.query(query, values)
  },

  delete(recipeID) {
    return db.query(`DELETE FROM recipes WHERE id = $1`, [recipeID])
  },

  paginate(filter, offset) {

    let query = "",
        filterQuery = "",
        totalQuery = `(
          SELECT count (*) FROM recipes
        ) AS total`
    
    if(filter) {
      filterQuery = `
        WHERE recipes.title ILIKE '%${filter}%'
      `
      totalQuery = `(
        SELECT count(*) FROM recipes
        ${filterQuery}
      ) AS total`
    }

    query = `
      SELECT recipes.*, ${totalQuery}
      FROM recipes
      ${filterQuery}
      LIMIT 12
      OFFSET $1
    `

    return db.query(query, [offset])
  }
}