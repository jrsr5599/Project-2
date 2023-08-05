// withauth declared for login route
const withAuth = (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect("/login");
  } else {
    next();
  }
};

// exports withauth
module.exports = withAuth;
