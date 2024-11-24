const admin = require("../config/firebase.config");
const song = require("../models/song");
const user = require("../models/user");

const router = require("express").Router();

router.get("/login", async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  
  if (!token) {
    return res.status(401).send({ message: "Authorization token missing" });
  }

  try {
    const decodedValue = await admin.auth().verifyIdToken(token);

    if (!decodedValue) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user exists
    const userExists = await user.findOne({ user_id: decodedValue.user_id });

    if (!userExists) {
      newUserData(decodedValue, req, res);
    } else {
      updateUserData(decodedValue, req, res);
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token or token verification error" });
  }
});

router.put("/favourites/:userId", async (req, res) => {
  const userId = req.params.userId;
  const songId = req.query.songId; // Ensure `songId` is passed as a query parameter

  try {
    const result = await user.updateOne({ _id: userId }, { $push: { favourites: songId } });

    if (result.nModified > 0) {
      res.status(200).send({ success: true, msg: "Song added to favourites" });
    } else {
      res.status(404).send({ success: false, msg: "User not found or song already in favourites" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

router.get("/getUsers", async (req, res) => {
  try {
    const users = await user.find().sort({ createdAt: 1 });

    if (users.length > 0) {
      res.status(200).send({ success: true, data: users });
    } else {
      res.status(404).send({ success: false, msg: "No users found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
});

router.get("/getUser/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userExists = await user.findOne({ _id: userId });

    if (!userExists) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    res.status(200).send({ success: true, data: userExists });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
});

router.put("/updateRole/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { role } = req.body.data;

  try {
    const result = await user.findOneAndUpdate({ _id: userId }, { role }, { new: true, upsert: true });

    if (result) {
      res.status(200).send({ user: result });
    } else {
      res.status(404).send({ success: false, msg: "User not found" });
    }
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
});

router.delete("/delete/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await user.deleteOne({ _id: userId });

    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "User deleted" });
    } else {
      res.status(404).send({ success: false, msg: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
});

router.put("/removeFavourites/:userId", async (req, res) => {
  const userId = req.params.userId;
  const songId = req.query.songId; // Ensure `songId` is passed as a query parameter

  try {
    const result = await user.updateOne({ _id: userId }, { $pull: { favourites: songId } });

    if (result.nModified > 0) {
      res.status(200).send({ success: true, msg: "Song removed from favourites" });
    } else {
      res.status(404).send({ success: false, msg: "User not found or song not in favourites" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

const newUserData = async (decodedValue, req, res) => {
  const newUser = new user({
    name: decodedValue.name,
    email: decodedValue.email,
    imageURL: decodedValue.picture,
    user_id: decodedValue.user_id,
    email_verified: decodedValue.email_verified,
    role: "member",
    auth_time: decodedValue.auth_time,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).send({ user: savedUser });
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
};

const updateUserData = async (decodedValue, req, res) => {
  const filter = { user_id: decodedValue.user_id };

  try {
    const result = await user.findOneAndUpdate(filter, { auth_time: decodedValue.auth_time }, { new: true, upsert: true });
    res.status(200).send({ user: result });
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
};

module.exports = router;
