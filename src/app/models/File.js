const db = require("../../config/database")
const fs = require("fs")

module.exports = {
  createRecipeImages(file, recipeId) {
    const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ( $1, $2 )
      RETURNING ID
    `

    const values = [file.filename, file.path]

    db.query(query, values, (err, results) => {
      if (err) throw `DATABASE error! ${err}`
      const fileId = results.rows[0].id
      const query = `
        INSERT INTO recipe_files (
          recipe_id,
          file_id
        ) VALUES ( $1, $2 )
        RETURNING ID
        `
      const values = [recipeId, fileId]

      return db.query(query, values)
    })
  },

  async deleteRecipeImages(recipeId) {
    try {
      let results = await db.query(
        `SELECT files.* 
        FROM files
        LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
        LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
        WHERE recipes.id = $1`,
        [recipeId]
      )
      const files = results.rows

      files.map((file) => {
        fs.unlinkSync(file.path)
        db.query(
          `DELETE FROM recipe_files WHERE file_id = $1`,
          [file.id],
          (err) => {
            if (err) throw new Error(err)
            return db.query(`DELETE FROM files WHERE id = $1`, [file.id])
          }
        )
      })
    } catch (err) {
      console.log(err)
    }
  },

  async deleteFile(id) {
    try {
      let results = await db.query(
        `SELECT files.* 
        FROM files
        WHERE files.id = $1`,
        [id]
      )
      const file = results.rows[0]
      fs.unlinkSync(file.path)
      db.query(
        `DELETE FROM recipe_files WHERE file_id = $1`,
        [file.id],
        (err) => {
          if (err) throw new Error(err)
          return db.query(`DELETE FROM files WHERE id = $1`, [file.id])
        }
      )
    } catch (err) {
      console.log(err)
    }
  },

  translateImagesURL(req, recipes) {
    recipes.map((recipe, index) => {
      recipes[index].image = {
        name: `${recipe.title}`,
        src: `${req.protocol}://${req.headers.host}${recipe.image.replace(
          "public",
          ""
        )}`,
      }
    })
  },
}
