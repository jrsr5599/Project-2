// defining route, requiring express and model
const router = require('express').Router();
const favoritesongs = require('../../models/favoritesongs');
const withAuth = require('../../utils/auth');

// get route to find all songs saved by user then render
router.get('/', async (req, res) => {
  try {
    const songList = await favoritesongs.findAll({
      include: [
        {
          model: favoritesongs,
          attributes: ['name'],
        },
      ],
    });
    res.render('homepage', {
      songList,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// post route
router.post('/', withAuth, async (req, res) => {
  console.log(req.body);
  try {
    // Check if the user is logged in before proceeding
    if (!req.session.logged_in) {
      res
        .status(401)
        .json({ message: 'You must be logged in to add a favorite song.' });
      return;
    }
    // Get the user input from the request body
    const { artist, album } = req.body;
    // Create the new favorite song/album in the database
    const newFavoriteSong = await favoritesongs.create({
      artist,
      album,
      user_id: req.session.user_id, 
    });
    res.status(201).json({
      message: 'Favorite song added successfully.',
      favoriteSong: newFavoriteSong,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const favsongDelete = await favoritesongs.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!favsongDelete) {
      res.status(404).json({ message: 'No songs found with this id!' });
      return;
    }

    res.status(200).json(favsongDelete);
  } catch (err) {
    res.status(500).json(err);
  }
});


// export routes
module.exports = router;
