// requiring express for route / models
const router = require("express").Router();
const { Favoritesongs, User } = require("../models");
const withAuth = require("../utils/auth");

// route to get favorite songs table from database for associated user
router.get("/", async (req, res) => {
  try {
    const favSong = await Favoritesongs.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    const favSongs = favSong.map((songs) => songs.get({ plain: true }));
    res.render("homepage", {
      favSongs,
      logged_in: req.session.logged_in,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// route for search results
router.get("/searchresults/:id", async (reg, res) => {
  try {
    const favSongData = await Favoritesongs.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const favSong = favSongData.get({ plain: true });

    res.render("searchresults", {
      ...favSong,
      logged_in: req.session.logged_in,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// route for search results
router.get("/searchresults", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Favoritesongs }],
    });
    const user = userData.get({ plain: true });
    res.render("searchresults", {
      ...user,
      logged_in: true,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/searchresults");
  } else {
    res.render("login");
  }
});

// exporting routes
module.exports = router;
