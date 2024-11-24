const album = require("../models/album");
const router = require("express").Router();

// Get all albums
router.get("/getAll", async (req, res) => {
  try {
    // Fetch all albums and sort them by creation date
    const albums = await album.find({}).sort({ createdAt: 1 });
    if (albums.length > 0) {
      res.status(200).send({ success: true, data: albums });
    } else {
      res.status(200).send({ success: true, msg: "No Data Found" });
    }
  } catch (error) {
    console.error("Error fetching all albums:", error);
    res.status(500).send({ success: false, msg: "Server Error" });
  }
});

// Get a single album by ID
router.get("/getOne/:getOne", async (req, res) => {
  const filter = { _id: req.params.getOne };

  try {
    const albumData = await album.findOne(filter);
    if (albumData) {
      res.status(200).send({ success: true, data: albumData });
    } else {
      res.status(200).send({ success: true, msg: "No Data Found" });
    }
  } catch (error) {
    console.error("Error fetching album by ID:", error);
    res.status(500).send({ success: false, msg: "Server Error" });
  }
});

// Save a new album
router.post("/save", async (req, res) => {
  const { name, imageURL } = req.body;

  if (!name || !imageURL) {
    return res.status(400).send({ success: false, msg: "Name and imageURL are required" });
  }

  const newAlbum = new album({ name, imageURL });

  try {
    const savedAlbum = await newAlbum.save();
    res.status(200).send({ success: true, album: savedAlbum });
  } catch (error) {
    console.error("Error saving new album:", error);
    res.status(400).send({ success: false, msg: error.message });
  }
});

// Update an album
router.put("/update/:updateId", async (req, res) => {
  const filter = { _id: req.params.updateId };
  const updateData = {
    name: req.body.name,
    imageURL: req.body.imageURL,
  };

  try {
    const result = await album.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
    if (result) {
      res.status(200).send({ success: true, album: result });
    } else {
      res.status(404).send({ success: false, msg: "Album Not Found" });
    }
  } catch (error) {
    console.error("Error updating album:", error);
    res.status(400).send({ success: false, msg: error.message });
  }
});

// Delete an album
router.delete("/delete/:deleteId", async (req, res) => {
  const filter = { _id: req.params.deleteId };

  try {
    const result = await album.deleteOne(filter);
    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "Data Deleted" });
    } else {
      res.status(404).send({ success: false, msg: "Album Not Found" });
    }
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).send({ success: false, msg: "Server Error" });
  }
});

module.exports = router;
