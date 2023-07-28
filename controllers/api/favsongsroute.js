const router = require('express').Router();
const favoritesongs = require('../../models/favoritesongs');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const songlist = await favoritesongs.findAll({
      include: [
        {
          model: favoritesongs,
          attributes: ['name'],
        },
      ],
    });
    res.render('searchresults', { 
      songlist, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    // Check if the user is logged in before proceeding
    if (!req.session.logged_in) {
      res.status(401).json({ message: 'You must be logged in to add a favorite song.' });
      return;
    }
    // Get the user input from the request body
    const { name, artist, album, genre } = req.body;

    // Validate the input (you can add more validation logic if needed)

    // Create the new favorite song in the database
    const newFavoriteSong = await favoritesongs.create({
      name,
      artist,
      album,
      genre,
      // Assuming you have a foreign key "user_id" to link the favorite song to the user who added it
      user_id: req.session.user_id, // Make sure you have the user_id in the session after login
    });

    // Send a response indicating success
    res.status(201).json({ message: 'Favorite song added successfully.', favoriteSong: newFavoriteSong });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
