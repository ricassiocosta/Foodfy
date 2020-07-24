const db = require('../../config/database')
const fs = require('fs')

module.exports = {
  create(file, recipeId) {
    const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ( $1, $2 )
      RETURNING ID
    `

    const values = [
      file.filename,
      file.path
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `DATABASE error! ${err}`
      const fileId = results.rows[0].id
      const query = `
        INSERT INTO recipe_files (
          recipe_id,
          file_id
        ) VALUES ( $1, $2 )
        RETURNING ID
        `
      const values = [
        recipeId,
        fileId
      ]

      return db.query(query, values)
    })
  },
}