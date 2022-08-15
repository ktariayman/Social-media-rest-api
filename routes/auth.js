const router = require("express").Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");
router.post("/register", async (req, res) => {
  try {
    // generate pass
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    // create user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    // save & return response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
