// defining route and requiring express and models
const router = require('express').Router();
const { User } = require('../../models');

// post route to create user when logging in/signing up
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json(userData);
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

// login route
router.post('/login', async (req, res) => {
  console.log(req.body);
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    console.log(userData);
    if (!userData) {
      res.status(400).json({
        message:
          'Invalid email or password, please try another email or password',
      });
      return;
    }
    const truePassword = await userData.checkPassword(req.body.password);
    if (!truePassword) {
      res.status(400).json({
        message:
          'Invalid email or password, please try another email or password',
      });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'Welcome! You are logged in.' });
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

// logout route
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// exporting route
module.exports = router;
