// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');
const logger = require('../../src/logger');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  //posting a fragment and then getting it
  test('posting a fragment and getting it', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Test Fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const res1 = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');

    expect(res1.body.fragments.length).toBe(1);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
