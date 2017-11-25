const moment = require('moment');
let User = require('../model/user');
const cache = require('memory-cache');

const dto2dao = user => {
    return new User({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDay: moment(user.birthDay, 'MM/DD/YYYY'),
        position: {
            type: 'Point',
            coordinates: [(user.position) ? user.position.lon : 0, (user.position) ? user.position.lat : 0]
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
    getAllUser: function (req, res, next) {
        let page = req.query.page || 0;
        if(users = cache.get('user-page-'+page)){
            return res.status(200).json(users);
        }
        User.find({}, (err, users) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            users = users.map(user => dao2dto(user));
            cache.put('user-page-'+page, users,1000);
            res.status(200).json(users);
        }).skip(100 * page).limit(100);
    },

    /* GET one user by id. */
    getUserByID: function (req, res, next) {
        if (!req.params.id)
            return res.status(404).json({error: 'no user with such id'});
        if(users = cache.get('user-id-'+req.params.id)){
            return res.status(200).json(users.map(user => dao2dto(user)));
        }
        User.findOne({'_id': req.params.id}, (err, user) => {
            if (err) {
                return res.status(404).json(err.message);
            }
            if (user) {
                user = dao2dto(user);
                cache.put('user-id-'+req.params.id, user,1000);
                res.json(user);
            } else {
                res.status(404).json({error: 'no user with such id'})
            }
        });
    },

    /* POST - Create new user */
    createUser: function (req, res, next) {
        const user = dto2dao(req.body);
        user.save((err, user) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            cache.clear();
            res.status(201).json(dao2dto(user));
        });
    },


    /* PUT - Update all user */
    updateAllUser: function (req, res, next) {
        let users = req.body.map(user => dto2dao(user));
        User.remove({}, (err) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            User.create(users, (err) => {
                if (err) {
                    return res.status(500).json(err.message);
                }
                cache.clear();
                User.find({}, (err, usersUpdated) => {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                    res.status(201);
                    res.json(usersUpdated.map(user => dao2dto(user)));
                });
            });
        });
    },


    /* PUT - Update one user by id */
    updateUserByID: function (req, res, next) {
        let userId = req.params.id;
        let user = dto2dao(req.body);
        user._id = userId;
        User.findByIdAndUpdate(userId, {$set: user}, (err, updatedUser) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            if (!updatedUser) {
                return res.status(404).json();
            }
            cache.clear();
            res.status(200).send(dao2dto(updatedUser));
        });
    },

    /* DELETE - Delete all user */
    deleteAllUser: function (req, res, next) {
        User.deleteMany({}, (err) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            cache.clear();
            res.status(200).json({});
        });
    },

    /* DELETE - Delete one user by id */
    deleteUserByID: function (req, res, next) {
        let userId = req.params.id;
        User.remove({_id: userId}, (err) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            cache.clear();
            res.status(204).json({message: 'User deleted'});
        });
    },


    searchNearUser: function (req, res, next) {
        if (!req.query.lon || !req.query.lat) {
            return res.status(500).json({message: 'latitude and longitude is needed'});
        }
        User.find()
            .where('position')
            .near({
                center: {
                    type: 'Point',
                    coordinates: [req.query.lon, req.query.lat]
                },
            })
            .limit(10)
            .exec((err, users) => {
                if (err) {
                    return res.status(500).json(err.message);
                }
                res.json(users.map(user => dao2dto(user)));
            });
    },


    /* GET one user by id. */
    searchUserByAge: function (req, res, next) {
        let page = req.query.page || 0;
        let isGt = req.query.gt; // Choose available param
        let ageThreshold = req.query.gt || req.query.eq; // Choose available param
        if(req.query.gt < 0 || req.query.gt < 0)
            return res.status(400).json({message:"the age must be positive"});

        /**
         * Default date from age
         */
        let defaultDate = moment(Date.now()).subtract(ageThreshold, 'year').format('MM/DD/YYYY');
        /**
         * Compute begin and end date span
         */
        let beginDate = moment(defaultDate).subtract(6, 'months').format('MM/DD/YYYY');
        let endDate = moment(defaultDate).add(6, 'months').format('MM/DD/YYYY');

        let dateMin = moment(Date.now()).subtract(ageThreshold, 'year').format('MM/DD/YYYY');
        let where = (isGt) ?
            {birthDay: {$lt: dateMin}} :
            {$and: [{birthDay: {$gt: beginDate}}, {birthDay: {$lt: endDate}}]};


        User.find(where, (err, users) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            res.json(users.map(user => dao2dto(user)));
        }).skip(100 * page).limit(100);
    },

    /* GET one user by id. */
    searchUserByName: function (req, res, next) {
        let page = req.query.page || 0;
        let name = req.query.term;
        User.find({lastName: new RegExp('^' + name + '$', "i")}, (err, users) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            res.json(users.map(user => dao2dto(user)));
        }).skip(100 * page).limit(100);

    },
};

module.exports = UserController;