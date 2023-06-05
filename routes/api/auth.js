const express = require("express");

const ctrl = require("../../controllers/auth")

const {validateBody, authenticate, upload} = require("../../middlewares");

const {userSchema} = require("../../models/index");
const { ctrlWrapper } = require("../../helpers");

const router = express.Router();

router.post("/register", validateBody(userSchema.registerSchema), ctrl.register)

router.post("/login", validateBody(userSchema.loginSchema), ctrl.login);

router.get("/current", authenticate,ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);
router.patch("/avatars", authenticate, upload.single("avatar"), ctrlWrapper(ctrl.updateAvatar))

module.exports = router;
