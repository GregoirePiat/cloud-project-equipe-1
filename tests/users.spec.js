import test from 'ava';
import express from 'express';

var request = require('supertest');
var bodyParser = require('body-parser');


function makeApp() {
    var app = express();
    app.use(bodyParser.json());

    app.get('/user', function(req, res) {
        res.json({ name: 'tobi' });
        res.status(200);
    });

    return app;
}

test('test1', async t => {
    t.plan(2);

    const res = await request(makeApp())
        .get('/user')
        .send({email: 'ava@rocks.com', password: '123123'});

    t.is(res.status, 200);
    t.is(res.text, JSON.stringify({ name: 'tobi' }));
});


/* BELOW SOME EXEMPLES -> TODO DELETE BEFORE FINAL VERSION
// This runs before all tests
test.before(t => {
    t.pass();
});

test('foo', t => {
    t.pass();
});

test('bar', async t => {
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});

test('can add numbers', t => {
    t.is(1 + 1, 2);
});*/