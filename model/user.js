let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    id: {type: String},
    firstName: {type: String, required: [true, "firstname can't be blank"]},
    lastName: {type: String, required: [true, "lastname can't be blank"]},
    position: {
        lat: {type: String, required: [true, "lat can't be blank"]},
        lon: {type: String, required: [true, "lon can't be blank"]},
    }
});
let User = mongoose.model('User',userSchema);
module.exports = User;