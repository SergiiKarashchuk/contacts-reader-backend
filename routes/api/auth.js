const express = require("express");

const ctrl = require("../../controllers/auth")

const {validateBody, authenticate} = require("../../middlewares");

const {userSchema} = require("../../models/index");

const router = express.Router();

router.post("/register", validateBody(userSchema.registerSchema), ctrl.register)

router.post("/login", validateBody(userSchema.loginSchema), ctrl.login);

router.get("/current", authenticate,ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
