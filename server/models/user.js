var mongoose = require('mongoose');
var UserSchema = mongoose.Schema(
  {
    name: String,
    password: { required: true, type: String, select: false },
    username: { required: true, type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
