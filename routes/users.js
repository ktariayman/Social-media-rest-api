const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Success , account has been updated ");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can update only your account ");
  }
});

// delete user

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json("Success , account has been deleteds ");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can delete only your account ");
  }
});

// get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // login without send password in response : userWithoutPassword
    const { password, updatedAt, ...userWithoutPassword } = user._doc;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put("/:id/follow", async (req, res) => {
  // check  if the user are same then error because user cannot follow himself
  if (req.body.userId !== req.body.id) {
    try {
      const user = await User.findById(req.params.id);
      const loggedInUser = await User.findById(req.body.userId);
      //check  if loggedInUser ( who is open) is not already a follower of the user
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await loggedInUser.updateOne({
          $push: { following: req.params.userId },
        });
        res.status(200).json("success , user has been followed");
      } else {
        res.status(403).json("you are already a follower");
      }
    } catch (error) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("can't follow yourself");
  }
});

router.put("/:id/unfollow", async (req, res) => {
  // check  if the user are same then error because user cannot follow himself
  if (req.body.userId !== req.body.id) {
    try {
      const user = await User.findById(req.params.id);
      const loggedInUser = await User.findById(req.body.userId);
      //check  if loggedInUser ( who is open) is not already a follower of the user
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await loggedInUser.updateOne({ $pull: { following: req.body.id } });
        res.status(200).json("success , user has been unfollowed");
      } else {
        res.status(403).json("you are not a follower");
      }
    } catch (error) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("can't unfollow yourself");
  }
});
module.exports = router;
