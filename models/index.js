const User = require("./users");
const Favoritesongs = require("./favoritesongs");

User.hasMany(Favoritesongs, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Favoritesongs.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = { User, Favoritesongs };
