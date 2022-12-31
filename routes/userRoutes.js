const express = require("express");
const router = express.Router();
const authController = require("../controllers/authCotroller");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/protect", authController.protect);

module.exports = router;
