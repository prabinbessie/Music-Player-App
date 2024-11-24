const song = require("../models/song");

const router = require("express").Router();

// Get all songs
router.get("/getAll", async (req, res) => {
  try {
    const options = {
      // sort returned documents in ascending order
      sort: { createdAt: 1 },
      // Include only the following
      // projection: {}
    };
    const songs = await song.find({}, null, options);  // Use an empty object to get all documents
    if (songs.length > 0) {
      res.status(200).send({ success: true, data: songs });
    } else {
      res.status(200).send({ success: true, msg: "No Data Found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error: error.message });
  }
});

// Get a single song by ID
router.get("/getOne/:getOne", async (req, res) => {
  try {
    const filter = { _id: req.params.getOne };
    const songData = await song.findOne(filter);
    if (songData) {
      res.status(200).send({ success: true, data: songData });
    } else {
      res.status(404).send({ success: false, msg: "No Data Found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error: error.message });
  }
});

// Save a new song
router.post("/save", async (req, res) => {
  try {
    const newSong = new song({
      name: req.body.name,
      imageURL: req.body.imageURL,
      songUrl: req.body.songUrl,
      album: req.body.album,
      artist: req.body.artist,
      language: req.body.language,
      category: req.body.category,
    });
    const savedSong = await newSong.save();
    res.status(201).send({ success: true, song: savedSong });
  } catch (error) {
    res.status(400).send({ success: false, msg: "Error saving song", error: error.message });
  }
});

// Update a song by ID
router.put("/update/:updateId", async (req, res) => {
  try {
    const filter = { _id: req.params.updateId };
    const options = { new: true, upsert: true };
    const updatedSong = await song.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        songUrl: req.body.songUrl,
        album: req.body.album,
        artist: req.body.artist,
        language: req.body.language,
        category: req.body.category,
      },
      options
    );
    if (updatedSong) {
      res.status(200).send({ success: true, song: updatedSong });
    } else {
      res.status(404).send({ success: false, msg: "Song Not Found" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: "Error updating song", error: error.message });
  }
});

// Delete a song by ID
router.delete("/delete/:deleteId", async (req, res) => {
  try {
    const filter = { _id: req.params.deleteId };
    const result = await song.deleteOne(filter);
    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "Data Deleted" });
    } else {
      res.status(404).send({ success: false, msg: "Data Not Found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error: error.message });
  }
});

// Get favourite songs
router.get("/getFavouritesSongs", async (req, res) => {
  try {
    const query = req.query.songId;
    // You might want to implement logic to handle the query parameter
    res.send({ success: true, query: query });
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error: error.message });
  }
});

module.exports = router;
