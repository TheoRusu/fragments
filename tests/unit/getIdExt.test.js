const request = require('supertest');

const app = require('../../src/app');
// const logger = require('../../src/logger');
// var MarkdownIt = require('markdown-it');

describe('GET /fragments/:id.ext', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:50.md').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/:50.md')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('fragment can convert from MD to html', async () => {
    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# This is a markdown fragment');

    const getResponse = await request(app)
      .get(`/v1/fragments/${postResponse.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.headers['content-type']).toBe('text/html; charset=utf-8');
  });
});
