let UserController =  {

    /* GET all user  */
    getAllUser: function(req, res, next) {
        res.json({message:"Get a list of users"});
    },

    /* GET one user by id. */
    getUserByID: function(req, res, next) {
        var userId = req.params.id;
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
        res.json({message:"Delete a list of users"});
    },

    /* DELETE - Delete one user by id */
    deleteUserByID: function(req, res, next) {
        var userId = req.params.id;
        res.json({message:"Delete user " + userId.text()});
    }
};

module.exports = UserController;
