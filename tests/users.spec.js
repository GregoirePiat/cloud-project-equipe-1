import test from 'ava';
import express from 'express';
let users = require('../routes/users');

let fiveUsers = require('./data/users.fiveUsers');
let thousandUsers = require('./data/users.thousandUsers');

var request = require('supertest');
var bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test',{ useMongoClient: true }); //Test database
mongoose.Promise = global.Promise;

const app = express();
app.use(bodyParser.json());
app.use('/user', users);

const dataBaseWith5Users = async () => {
  const put5Users = await request(app).put('/user/').send(fiveUsers);
  return put5Users.body;
};

const dataBaseWith1000Users = async () => {
  const put5Users = await request(app).put('/user/').send(thousandUsers);
  return put5Users.body;
};

test.serial('getAllUsers - Status code should be 200', async t => {
    const resetedDatabase = await dataBaseWith5Users();
    const res = await request(app).get('/user/');
    t.is(res.status, 200);
});

test.serial('getAllUsers pagination - Status code should be 200', async t => {
    const resetedDatabase = await dataBaseWith1000Users();
    const res = await request(app).get('/user?page=5');
    t.is(res.status, 200);
});

test.serial('getUserByID - Status code should be 200', async t => {
    const resetedDatabase = await dataBaseWith5Users();
    const res = await request(app).get('/user/' + resetedDatabase[0].id);
    t.is(res.status, 200);
});

test.serial('createUser - Status code should be 201', async t => {
    const resetedDatabase = await dataBaseWith5Users();
    const resAdd = await request(app).post('/user/').send(thousandUsers[80]);
    t.is(resAdd.status, 201);
});

test.serial('updateAllUser - Status code should be 201', async t => {
    const usersUpdated = await dataBaseWith5Users();

    // update some users
    usersUpdated[0].lastName = "Nvos";
    usersUpdated[0].firstName = "Strelytsia";

    usersUpdated[1].lastName = "yolob";
    usersUpdated[1].firstName = "Agory";

    const resUpdate = await request(app).put('/user/').send(usersUpdated);

    t.is(resUpdate.status, 201);
});

test.serial('updateUserByID - Status code should be 200', async t => {
    const resetedDatabase = await dataBaseWith5Users();
    let userToUpdate = resetedDatabase[0];

    // update 1 user
    userToUpdate.lastName = "Nvos";
    userToUpdate.firstName = "Strelytsia";

    const resultUpdate = await request(app).put('/user/' + userToUpdate.id).send(userToUpdate);
    t.is(resultUpdate.status, 200);
});

test.serial('deleteAllUser should return 200', async t => {
    const resetedDatabase = await dataBaseWith5Users();
    const resDel = await request(app)
        .delete('/user/');
    t.is(resDel.status, 200);
});

test.serial('deleteUserByID should return 204 No content on delete success', async t => {
    const resetedDatabase = await dataBaseWith5Users();
    const userToDelete = resetedDatabase[0];
    const resultDel = await request(app).delete('/user/' + userToDelete.id);
    t.is(resultDel.status, 204);
});

test.serial('deleteUserByID should return 500 if user doesn\'t exists', async t => {
    const resetedDatabase = await dataBaseWith5Users();
    const resultDel = await request(app).delete('/user/toto');
    t.is(resultDel.status, 500);
});