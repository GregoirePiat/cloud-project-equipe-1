let mongoose = require('mongoose');
let positionSchema = mongoose.Schema({
    position: {
        lat: {type: String, required: [true, "lat can't be blank"]},
        lon: {type: String, required: [true, "lon can't be blank"]},
    }
});
let Position = mongoose.model('Position',positionSchema);
module.exports = Position;