let mongoose = require('mongoose');


let userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "firstname can't be blank"]
  },
  lastName: {
    type: String,
    required: [true, "lastname can't be blank"]
  },
  position: {
    type: {
      type: String
    },
    coordinates: [Number],
  },
  birthDay: Date
});

userSchema.index({"position": '2dsphere'});
userSchema.index({firstName: 'text', lastName: 'text'});

let User = mongoose.model('User', userSchema);
module.exports = User;