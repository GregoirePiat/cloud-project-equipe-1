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
        User.find({}, (err, users) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            res.json(users.map(user => dao2dto(user)));
        });
    },

    /* GET one user by id. */
    getUserByID: function(req, res, next) {
        let userId = req.params.id;
        console.log(userId);
        User.findOne({'_id': userId}, (err, user) => {
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
        let users = req.body.map(user => dto2dao(user));
        User.remove({}, (err) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            User.create(users, (err) => {
                if (err) {
                    return res.status(500).json(err.message);
                }
                User.find({}, (err, usersUpdated) => {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                    res.json(usersUpdated.map(user => dao2dto(user)));
                });
            });
        });
    },


    /* PUT - Update one user by id */
    updateUserByID: function(req, res, next) {
        console.log(req.params);
        let user = dto2dao(req.body);
        let userId = req.params.id;
        User.findByIdAndUpdate({_id: user._id}, {$set: user}, function(err, updatedUser) {
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
        User.deleteMany({}, (err) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            res.json({message: 'All users deleted'});
        });
    },

    /* DELETE - Delete one user by id */
    deleteUserByID: function(req, res, next) {
        let userId = req.params.id;
        User.remove({_id: userId}, (err) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            res.status(201).json({message: 'User deleted'});
        });
    },

    //Add a user
    addUser: function(req, res, next) {
        let user = new User({firstName: 'Polyetch'});
        user.save();
        res.json({message: 'Add polytech'});
    }
};

module.exports = UserController;
