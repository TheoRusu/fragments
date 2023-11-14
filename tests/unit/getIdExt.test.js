const request = require('supertest');

const app = require('../../src/app');
const logger = require('../../src/logger');

describe('GET /v1/fragments/:id.ext', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:50.md').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/:50.md')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('posting a markdown fragment and getting it as html', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# This is a markdown fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const res1 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');

    const fragmentData = res1.body.fragmentData;

    logger.debug({ fragmentData }, 'GETID: fragmentData');
    expect(res1.body.fragmentData).toEqual('<h1>This is a markdown fragment</h1>\n');
  });
});
