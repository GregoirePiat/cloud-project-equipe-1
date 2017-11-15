let UserController =  {

    /* GET all user  */
    getAllUser: function(req, res, next) {
        User.find({}, function(err, users) {
            res.json(users);
        });
    },

    /* GET one user by id. */
    getUserByID: function(req, res, next) {
        var userId = req.params.id;
        var User = User.findOne({'id': userId});
        res.json({message:"This is user " + userId});
    },

    /* POST - Create new user */
    createUser: function(req, res, next) {
        res.json({message:"Adding a new user"}, 201);
    },


    /* PUT - Update all user */
    updateAllUser: function(req, res, next) {
        res.json({message:"Update a list of users"}, 201);
    },
    /* PUT - Update one user by id */
    updateUserByID: function(req, res, next) {
        var userId = req.params.id;
        res.json({message:"Update user " + userId.text()}, 201);
    },

    /* DELETE - Update all user */
    deleteAllUser: function(req, res, next) {
        User.deleteMany();
        res.json({message:"Delete a list of users"});
    },

    /* DELETE - Delete one user by id */
    deleteUserByID: function(req, res, next) {
        let userId = req.params.id;
        User.deleteOne({id: userId});
        res.json({message:"Delete user with id: " + userId.text()});
    }
};

module.exports = UserController;
