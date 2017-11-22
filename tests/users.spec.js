import test from 'ava';
import express from 'express';
let users = require('../routes/users');

let initialData = require('./users.initialData');
let initialDataId = [];

var request = require('supertest');
var bodyParser = require('body-parser');


// Create a app's new instance to avoid problems - used in every other test
function makeApp() {
    var app = express();
    app.use(bodyParser.json());
    app.use('/user', users);
    return app;
}

// This test runs before all tests - add 5 users to use for later tests
test.before(async t => {
    for (var i=0; i < initialData.length; i++) {
        const res = await request(makeApp())
            .post('/user/')
            .send(initialData[i]);
    }
    t.pass();
});

test('getAllUsers', async t => {
    const res = await request(makeApp())
        .get('/user/');

    t.is(res.status, 200);
    t.is(res.text, JSON.stringify(initialData));
});

test('getUserByID', async t => {
    var midTabIndex = Math.floor(initialData.length / 2);
    console.log(initialData[midTabIndex]);
    console.log(initialDataId[midTabIndex]);

    const resById = await request(makeApp())
        .get('/user/' + initialDataId);

    t.is(resById.status, 200);

    //get all users to get id of added user
    const resAll = await request(makeApp())
        .get('/user/');

    var addedUser = null;
    for (var i = 0; i < resAll.text.length; i++) {
        if (resAll.text[i].firstName == initialData[midTabIndex].firstName &&
            resAll.text[i].lastName == initialData[midTabIndex].lastName &&
            resAll.text[i].position == initialData[midTabIndex].position) {
            addedUser = resAll.text[i];
        }
    }

    // check getById result
    t.is(resById.text, JSON.stringify(addedUser));
});

test('createUser', async t => {
    // add first user from initial data
    const resAdd = await request(makeApp())
        .post('/user/')
        .send(JSON.stringify(initialData[0]));
    t.is(resAdd.status, 201);
    // user was added correctly ?
    //get all users to get id of added user
    const resAll = await request(makeApp())
        .get('/user/');

    var addedUser = null;
    for (var i = 0; i < resAll.text.length; i++) {
        if (resAll.text[i].firstName == initialData[0].firstName &&
            resAll.text[i].lastName == initialData[0].lastName &&
            resAll.text[i].position == initialData[0].position) {
            addedUser = resAll.text[i];
        }
    }

    //get added user by id
    const resById = await request(makeApp())
        .get('/user/' + addedUser.id);

    t.is(resById.text, JSON.stringify(addedUser));
});

test('updateAllUser', async t => {
    // update some users
    let usersUpdated = initialData;
    usersUpdated[0].lastName = "Nvos";
    usersUpdated[0].firstName = "Strelytsia";
    usersUpdated[0].position[0] = "Abyssal Plane";

    usersUpdated[1].lastName = "yolob";
    usersUpdated[1].firstName = "Agory";
    usersUpdated[1].position[0] = "Faery realm";

    const resUpdate = await request(makeApp())
        .put('/user/')
        .send(JSON.stringify(usersUpdated));

    t.is(resUpdate.status, 201);

    // get all users anew
    const resAllUsers = await request(makeApp())
        .get('/user/');

    // test if old users were updated
    t.is(resAllUsers.text[0].lastName, "Nvos");
    t.is(resAllUsers.text[0].firstName, "Strelytsia");
    t.is(resAllUsers.text[0].position[0], "Abyssal Plane");

    t.is(resAllUsers.text[0].lastName, "yolob");
    t.is(resAllUsers.text[1].firstName, "Agory");
    t.is(resAllUsers.text[1].position[0], "Faery realm");
});

test('updateUserByID', async t => {
    // add first user from initial data
    const resAdd = await request(makeApp())
        .post('/user/')
        .send(JSON.stringify(initialData[0]));

    // select all users to get json of addedUser
    const resAll = await request(makeApp())
        .get('/user/');

    var addedUser = null;
    for (var i = 0; i < resAll.text.length; i++) {
        if (resAll.text[i].firstName == initialData[0].firstName &&
            resAll.text[i].lastName == initialData[0].lastName &&
            resAll.text[i].position == initialData[0].position) {
            addedUser = resAll.text[i];
        }
    }

    // update added user
    let newUser = addedUser;
    newUser.lastName = "Nvos";
    newUser.firstName = "Strelytsia";
    newUser.position[0] = "Abyssal Plane";

    const resUpdate = await request(makeApp())
        .put('/user/' + addedUser.id)
        .send(JSON.stringify(newUser));
    t.is(resUpdate.status, 201);

    // select added user - has he been correctly updated ?
    const resById = await request(makeApp())
        .get('/user/' + newUser.id);
    t.is(resById.status, 200);
    t.is(resById.text.lastName, "Nvos");
    t.is(resById.text.firstName, "Strelytsia");
    t.is(resById.text.position[0], "Abyssal Plane");
    t.is(resById.text.position[1], JSON.stringify(newUser.position[1]));
    t.is(resById.text.birthday, JSON.stringify(newUser.birthday));
});

test('deleteAllUser', async t => {
    // select all users and count how many there are
    const resAllBefore = await request(makeApp())
        .get('/user/');

    let nbUsers = resAllBefore.text.length;

    // delete all users
    const resDel = await request(makeApp())
        .delete('/user/');
    t.is(resDel.status, 200);

    // is everything effectively deleted ?
    const resAllAfter = await request(makeApp())
        .get('/user/');
    t.is(resAllAfter.status, 200);
    t.is(resAllAfter.text, JSON.stringify('{}')); // should be empty
});

test('deleteUserByID', async t => {
    // select all users
    const resAllBefore = await request(makeApp())
        .get('/user/');

    // delete the first user
    let userToDel = resAllBefore.text[0];

    const resDel = await request(makeApp())
        .delete('/user/' + userToDel.id);
    t.is(resDel.status, 204);

    // is he effectively deleted ?
    const resById = await request(makeApp())
        .get('/user/' + userToDel.id);
    t.is(resById.status, 500);
});
