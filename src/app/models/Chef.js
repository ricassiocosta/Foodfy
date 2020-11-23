const fs = require("fs")
const db = require("../../config/database")
const Base = require("./Base")

Base.init({ table: "chefs" })

module.exports = {
  ...Base,
  async getRecipes(id) {
    const results = await db.query(
      `
      SELECT DISTINCT ON (recipes.title) recipes.id, recipes.title, files.path AS image
      FROM recipes
      LEFT JOIN recipe_files ON(recipes.id = recipe_files.recipe_id)
      LEFT JOIN files ON(recipe_files.file_id = files.id)
      WHERE recipes.chef_id = $1
    `,
      [id]
    )
    return results.rows
  },

  async getAvatar(id) {
    const results = await db.query(
      `
        SELECT path as avatar_url
        FROM chefs
        LEFT JOIN files ON (chefs.file_id = files.id)
        WHERE chefs.id = $1 
      `,
      [id]
    )
    return results.rows[0].avatar_url
  },

  async createAvatar(id, file) {
    try {
      const query = `
        INSERT INTO files (
          name,
          path
        ) VALUES ( $1, $2 )
        RETURNING ID
      `

      const values = [file.filename, file.path]

      db.query(query, values, async (err, results) => {
        if (err) throw `DATABASE error! ${err}`
        const fileId = results.rows[0].id
        const query = `
          UPDATE chefs
          SET file_id = $1
          WHERE chefs.id = $2
          `
        const values = [fileId, id]

        results = await db.query(query, values)
        return results.rows[0]
      })
    } catch (err) {
      console.error(err)
    }
  },

  async updateAvatar(id, file) {
    try {
      let results = await db.query(
        `
        SELECT files.id, path FROM chefs
        LEFT JOIN files ON (chefs.file_id = files.id)
        WHERE chefs.id = $1
        `,
        [id]
      )
      const oldAvatar = results.rows[0]

      let query = `
        INSERT INTO files (
          name,
          path
        ) VALUES ( $1, $2 )
        RETURNING ID
      `
      let values = [file.filename, file.path]
      results = await db.query(query, values)
      const newAvatarId = results.rows[0].id

      query = `
        UPDATE chefs
        SET file_id = $1
        WHERE chefs.id = $2
      `
      values = [newAvatarId, id]
      results = await db.query(query, values)

      fs.unlinkSync(oldAvatar.path)
      await db.query(`DELETE FROM files WHERE id = $1`, [oldAvatar.id])

      return results.rows
    } catch (err) {
      console.error(err)
    }
  },

  async deleteAvatar(id) {
    try {
      let results = await db.query(
        `SELECT files.* 
        FROM chefs
        LEFT JOIN files ON (chefs.file_id = files.id)
        WHERE chefs.id = $1`,
        [id]
      )
      const avatar = results.rows[0]
      fs.unlinkSync(avatar.path)
      return db.query(`DELETE FROM files WHERE id = $1`, [avatar.id])
    } catch (err) {
      console.error(err)
    }
  },

  async delete(id) {
    this.deleteAvatar(id)
    return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
  },
}

/*
  show(id) {
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
      `, [id])
  },
  */
