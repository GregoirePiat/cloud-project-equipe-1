var express = require('express');
var router = express.Router();
let UserController = require('../controller/user.controller');

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
router.post('/', function(req, res, next) {
    res.json({message:"Adding a new user"}, 201);
});

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
    UserController.deleteAllUser(req,res,next);
});

/* DELETE - Delete one user by id */
router.delete('/:id', function(req, res, next) {
    UserController.deleteUserByID(req,res,next);
});

module.exports = router;