const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables
const cors = require("cors");
const mongoose = require("mongoose");

// Middleware setup
app.use(cors({ origin: true }));
app.use(express.json());

// User authentication routes
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);

// Artist links
const artistsRoute = require("./routes/artists");
app.use("/api/artists/", artistsRoute);

// Album links
const albumRoute = require("./routes/albums");
app.use("/api/albums/", albumRoute);

// Songs links
const songRoute = require("./routes/songs");
app.use("/api/songs/", songRoute);

// Connect to MongoDB using the connection string from the environment variable
mongoose.connect(process.env.DB_STRING)
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Monitor MongoDB connection errors
mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
});


// Start the Express server
app.listen(4000, () => {
  console.log("Listening to port 4000");
});
