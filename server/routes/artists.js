const express = require('express');
const router = express.Router();
const artist = require('../models/artist'); // Adjust the path if needed

// Get all artists
router.get('/getAll', async (req, res) => {
  try {
    const artists = await artist.find({}).sort({ createdAt: 1 });
    res.status(200).send({ success: true, data: artists });
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
});

// Get one artist by ID
router.get('/getOne/:getOne', async (req, res) => {
  try {
    const artistData = await artist.findOne({ _id: req.params.getOne });
    if (artistData) {
      res.status(200).send({ success: true, data: artistData });
    } else {
      res.status(404).send({ success: false, msg: "No Data Found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
});

// Save a new artist
router.post('/save', async (req, res) => {
  const newArtist = new artist({
    name: req.body.name,
    imageURL: req.body.imageURL,
    twitter: req.body.twitter,
    instagram: req.body.instagram,
  });

  try {
    const savedArtist = await newArtist.save();
    res.status(201).send({ success: true, artist: savedArtist });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

// Update an artist
router.put('/update/:updateId', async (req, res) => {
  const filter = { _id: req.params.updateId };
  const options = { new: true, runValidators: true };

  try {
    const updatedArtist = await artist.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
      },
      options
    );
    if (updatedArtist) {
      res.status(200).send({ success: true, artist: updatedArtist });
    } else {
      res.status(404).send({ success: false, msg: "Artist Not Found" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

// Delete an artist
router.delete('/delete/:deleteId', async (req, res) => {
  try {
    const result = await artist.deleteOne({ _id: req.params.deleteId });
    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "Data Deleted" });
    } else {
      res.status(404).send({ success: false, msg: "Data Not Found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message });
  }
});

module.exports = router;
