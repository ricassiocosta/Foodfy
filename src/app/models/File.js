const db = require('../../config/database')
const fs = require('fs')

module.exports = {
  createRecipeImages(file, recipeId) {
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

  async deleteRecipeImages(fileId) {
    try {
      let results = await db.query(`SELECT * FROM files WHERE id = $1`, [fileId])
      const file = results.rows[0]

      fs.unlinkSync(file.path)
      db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [fileId], (err) => {
        if(err) throw new Error(err)
        return db.query(`DELETE FROM files WHERE id = $1`, [fileId])
      })
    } catch(err) {
      console.log(err)
    }
  },

  createChefAvatar(file, chefId) {
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
        UPDATE chefs
        SET file_id = $1
        WHERE chefs.id = $2
        `
      const values = [
        fileId,
        chefId
      ]

      return db.query(query, values)
    })
  },

  translateImagesURL(req, recipes) {
    recipes.map((recipe, index) => {
      recipes[index].image = {
        name: `${recipe.title}`,
        src: `${req.protocol}://${req.headers.host}${recipe.image.replace("public", "")}`
      }
    })
  }
}