const request = require('supertest');
const server = require('./server');

test('sanity', () => {
  expect(true).toBe(true);
});

const peter = { name: 'Peter' };

describe('server', () => {
  describe('server api working', () => {
    it('responds with string -up & running-', async () => {
      const res = await request(server).get('/');
      expect(res.body.api).toBe('up & running');
    });
  });

  // describe('register new user', () => {
  //   it('')
  // })
});
