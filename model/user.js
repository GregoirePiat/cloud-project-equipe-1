let mongoose = require('mongoose');
let Position = require('position');
let userSchema = mongoose.Schema({
    id: {type: String},
    firstName: {type: String, required: [true, "firstname can't be blank"]},
    lastName: {type: String, required: [true, "lastname can't be blank"]},
    position: {type: Position}
});
let User = mongoose.model('User',userSchema);
module.exports = User;