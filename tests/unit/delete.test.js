const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  test('posting a fragment and deleting it', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Test Fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const res1 = await request(app)
      .delete(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(res1.statusCode).toBe(200);

    const res2 = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(404);
  });
});
