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
/* PUT - Update all user */
router.post('/', function(req, res, next) {
    res.json({message:"Adding a new user"});
});

/**
 * PUT
 */
/* PUT - Update all user */
router.put('/', function(req, res, next) {
    res.json({message:"Update a list of users"});
});

/* PUT - Update one user by id */
router.put('/:id', function(req, res, next) {
    var userId = req.params.id;
    res.json({message:"Update user " + userId.text()});
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
