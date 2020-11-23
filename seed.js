const faker = require("faker")
const { hash } = require("bcryptjs")
const User = require("./src/app/models/User")
const Recipe = require("./src/app/models/Recipe")
const Chef = require("./src/app/models/Chef")
const File = require("./src/app/models/File")

let usersIds = []
let chefsIds = []
let totalRecipes = 15
let totalUsers = 3
let totalChefs = 5

async function createUsers() {
  const users = []
  const password = await hash("1234", 8)
  while (users.length < 3) {
    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      is_admin: faker.random.boolean(),
    })
  }

  const usersPromise = users.map((user) => User.create(user))
  usersIds = await Promise.all(usersPromise)
}

async function createChefs() {
  let chefs = []

  while (chefs.length < totalChefs) {
    chefs.push({
      name: faker.name.firstName(),
    })
  }

  const chefsPromise = chefs.map((chef) => Chef.create(chef))
  chefsIds = await Promise.all(chefsPromise)

  let files = []

  while (files.length < 30) {
    files.push({
      filename: faker.name.title(),
      path: `public/images/person.jpg`,
    })
  }

  const filesPromise = files.map((file) =>
    Chef.createAvatar(chefsIds[Math.floor(Math.random() * totalChefs)].id, file)
  )

  await Promise.all(filesPromise)
}

async function createRecipes() {
  let recipes = []

  while (recipes.length < totalRecipes) {
    recipes.push({
      chef: chefsIds[Math.floor(Math.random() * totalChefs)].id,
      loggedUser: usersIds[Math.floor(Math.random() * totalUsers)].id,
      title: faker.name.title(),
      ingredients: [faker.random.words()],
      preparation: [faker.random.words()],
      information: faker.lorem.paragraph(),
    })
  }

  const recipesPromise = recipes.map((recipe) => Recipe.create(recipe))
  let recipesIds = await Promise.all(recipesPromise)

  let files = []

  while (files.length < 80) {
    files.push({
      filename: faker.name.title(),
      path: `public/images/food.jpg`,
    })
  }

  const filesPromise = files.map(async (file) =>
    File.createRecipeImages(
      file,
      recipesIds[Math.floor(Math.random() * totalRecipes)].id
    )
  )

  await Promise.all(filesPromise)
}

async function init() {
  await createUsers()
  await createChefs()
  await createRecipes()
}

init()
