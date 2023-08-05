// requiring both models
const User = require('./users');
const Favoritesongs = require('./favoritesongs');

// relationship between the models
User.hasMany(Favoritesongs, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
Favoritesongs.belongsTo(User, {
  foreignKey: 'user_id',
});

// export both models  with relationship
module.exports = { User, Favoritesongs };
