import test from 'ava';


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
});