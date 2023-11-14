const request = require('supertest');

const app = require('../../src/app');
const logger = require('../../src/logger');

describe('GET /v1/fragments/:id/info', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:50/info').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/:50/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users give success result', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('posting a fragment and getting its metadata', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Test Fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const res1 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}/info`)
      .auth('user1@email.com', 'password1');

    const fragment = res1.body;

    logger.debug({ fragment }, 'GET:ID/Info - Fragment');
    expect(res1.body.fragmentMetadata.id).toEqual(res.body.fragment.id);
  });
});
