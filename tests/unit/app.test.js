const request = require('supertest');

const app = require('../../src/app');

describe('HTTP Unit Test', () => {
  test('404 handler is being hit', async () => {
    const res = await request(app).get('/fake');
    expect(res.status).toBe(404);
  });
});
