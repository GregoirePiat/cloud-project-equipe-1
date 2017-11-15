const moment = require('moment');
let User = require('../model/user');

const dto2dao = user => {

    return new User({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDay: moment(user.birthDay, 'MM/DD/YYYY'),
        position: {
            type: 'Point',
            coordinates: [user.position.lon, user.position.lat]
        }
    });
};

const dao2dto = user => {
    return ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDay: moment(user.birthDay).format('L'),
        position: {
            lat: user.position.coordinates[1],
            lon: user.position.coordinates[0],
        }
    });
};



let UserController = {

    /* GET all user  */
    getAllUser: function(req, res, next) {
        User.find({}, function(err, users) {
            res.json(users.map(user => dao2dto(user)));
        });
    },

    /* GET one user by id. */
    getUserByID: function(req, res, next) {
        let userId = req.params.id;
        console.log(userId);
        User.findOne({'_id': userId}, function(err, user) {
            if (err) {
                console.log(err);
                return res.status(500).json(err.message);
            }
            if (user) {
                res.json(dao2dto(user));
            } else {
                res.status(404);
                res.json({error: 'no user with such id'})
            }
        });
    },

    /* POST - Create new user */
    createUser: function(req, res, next) {
        const user = dto2dao(req.body);
        user.save((err, user) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            res.status(201).json(dao2dto(user));
        });
    },


    /* PUT - Update all user */
    updateAllUser: function(req, res, next) {
        res.json({
            message: 'Update a list of users'
        }, 201);
    },


    /* PUT - Update one user by id */
    updateUserByID: function(req, res, next) {
        console.log(req.params);
        let user = dto2dao(req.body);
        let userId = req.params.id;

        User.findByIdAndUpdate({ _id: userId }, { $set: user}, function(err, updatedUser) {
            if (err) {
                console.log(err);
                return res.status(500).json(err.message);
            }
            res.status(201);
            res.send(dao2dto(updatedUser));
        });
    },

    /* DELETE - Update all user */
    deleteAllUser: function(req, res, next) {
        User.deleteMany();
        res.json({message: 'Delete a list of users'});
    },

    /* DELETE - Delete one user by id */
    deleteUserByID: function(req, res, next) {
        let userId = req.params.id;
        let user = User.findById(userId);
        user.deleteOne((err, user) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            res.status(201).json(dao2dto(user));
        })
    },

    //Add a user
    addUser: function(req, res, next) {
        let user = new User({firstName: 'Polyetch'});
        user.save();
        res.json({message: 'Add polytech'});
    }
};

module.exports = UserController;
