const userController = require('../controller/user.controller');
var express = require('express');
var router = express.Router();
let UserController = require('../controller/user.controller');


/**
 * GET
 */
/* GET users listing. */
router.get('/', UserController.getAllUser);

/* GET one user by id. */
router.get('/:id', UserController.getUserByID);


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
router.delete('/', UserController.deleteAllUser);

/* DELETE - Delete one user by id */
router.delete('/:id', UserController.deleteUserByID);

/**
 * Add Polytech
 */
/* DELETE - Delete one user by id */
router.put('/add', UserController.addUser);

module.exports = router;
