const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("hey users route ");
});
module.exports = router;
