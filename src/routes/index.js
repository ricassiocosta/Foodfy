const routes = require("express").Router()
const recipesController = require("../app/controllers/recipesController")
const chefsController = require("../app/controllers/chefsController")
const sessionController = require("../app/controllers/sessionController")
const sessionValidator = require("../app/validators/session")
const admin = require("./admin")

routes.get("/", recipesController.mostAccessed)
routes.get("/sobre", (req, res) => {
  return res.render("site/about")
})
routes.get("/receitas", recipesController.index)
routes.get("/chefs", chefsController.listing)
routes.get("/receitas/:recipe_id", recipesController.show)
routes.get("/login", sessionController.loginForm)
routes.get("/logout", sessionController.logout)
routes.post("/login", sessionValidator.login, sessionController.login)
routes.get("/recuperar-senha", sessionController.forgotForm)
routes.post(
  "/recuperar-senha",
  sessionValidator.forgot,
  sessionController.forgot
)
routes.get("/nova-senha", sessionController.resetForm)
routes.post("/nova-senha", sessionValidator.reset, sessionController.reset)

routes.use("/admin", sessionValidator.checkIfUserIsLogged, admin)

module.exports = routes
