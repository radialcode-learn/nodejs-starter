var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // Cookies that have not been signed
  console.log("Cookies: ", req.cookies);

  // Cookies that have been signed
  console.log("Signed Cookies: ", req.signedCookies);

  // TODO You can define template variables using locals as well as in render method below
  res.locals.title = "Express";

  res.render("index", { title: "Express.....ion" });
});

module.exports = router;
