let mongoose = require('mongoose');


let userSchema = mongoose.Schema({
    firstName: {type: String },
    lastName: {type: String},
    birthDay: Date,
    position: {
        type: {type: String},
        coordinates: [Number],
    },
});

userSchema.index({"position": '2dsphere'});
userSchema.index({firstName: 'text', lastName: 'text'});

let User = mongoose.model('User', userSchema);
module.exports = User;