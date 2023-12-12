const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:50').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/:50')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('fragment data is retrieved by id', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Test Fragment');

    const getRes = await request(app)
      .get(`/v1/fragments/${postRes.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe('Test Fragment');
    expect(getRes.headers['content-type']).toBe('text/plain');
  });
});
