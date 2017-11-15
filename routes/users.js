const userController = require('../controller/user.controller');
var express = require('express');
var router = express.Router();

/**
 * GET
 */
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json({message:"Get a list of users"});
});

/* GET one user by id. */
router.get('/:id', function(req, res, next) {
    var userId = req.params.id;
    res.json({message:"This is user " + userId});
});


/**
 * POST
 */
/* POST - Create new user */
router.post('/', userController.createUser);

/**
 * PUT
 */
/* PUT - Update all user */
router.put('/', function(req, res, next) {
    res.json({message:"Update a list of users"}, 201);
});

/* PUT - Update one user by id */
router.put('/:id', function(req, res, next) {
    var userId = req.params.id;
    res.json({message:"Update user " + userId.text()}, 201);
});


/**
 * DELETE
 */
/* DELETE - Update all user */
router.delete('/', function(req, res, next) {
    res.json({message:"Delete a list of users"});
});

/* DELETE - Delete one user by id */
router.delete('/:id', function(req, res, next) {
    var userId = req.params.id;
    res.json({message:"Delete user " + userId.text()});
});




module.exports = router;
