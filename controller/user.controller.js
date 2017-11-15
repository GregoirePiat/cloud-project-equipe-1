const moment = require('moment');
let User = require('../model/user');

const dto2dao = user => {

  return new User({
    firstName: user.firstName,
    lastName: user.lastName,
    birthDay: moment(user.birthDay, 'MM/DD/YYYY'),
    position: {
      type: "Point",
      coordinates: [user.position.lon, user.position.lat]
    }
  });
};

const dao2dto = User => {
  return ({
    firstName: User.firstName,
    lastName: User.lastName,
    id: User._id,
    birthDay: moment(User.birthDay).format('L'),
    position: {
      lat: User.position.coordinates[1],
      lon: User.position.coordinates[0],
    }
  });
}



let UserController = {

    /* GET all user  */
    getAllUser: function(req, res, next) {
        User.find({}, function(err, users) {
            var usersDto;

            for (var i = 0, len = users.length; i < len; i++) {
                usersDto.add(users[i]);
            }
            res.json(usersDto);
        });
    },

    /* GET one user by id. */
    getUserByID: function(req, res, next) {
        var userId = req.params.id;
        var User = User.findOne({'id': userId}, function(err, user) {
            res.json(dao2dto(user));
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
  AllUser: function(req, res, next) {
    res.json({
      message: "Update a list of users"
    }, 201);
  },


  /* PUT - Update one user by id */
  updateUserByID: function(req, res, next) {
    var userId = req.params.id;
    var newFirstname = req.params.firstname;
    var newLastName = req.params.lastname;
    var newPosition = req.params.position;
    var user = User.findById(userId);
    user.set({
      firstname: newFirstname,
      lastname: newLastName,
      position: newPosition
    });
    user.save(function(err, updatedUser) {
      if (err) return handleError(err);
      res.send(updatedUser);
    });
    res.json({
      message: "Update user " + userId.text()
    }, 201);
  },

    /* DELETE - Update all user */
    deleteAllUser: function(req, res, next) {
        User.deleteMany();
        res.json({message:"Delete a list of users"});
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
    addUser: function (req,res,next) {
        let user = new User({firstName: 'Polyetch'});
        user.save();
        res.json({message:"Add polytech"});
    }
};

module.exports = UserController;
