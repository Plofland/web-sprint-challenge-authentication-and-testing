const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

test('sanity', () => {
  expect(true).toBe(true);
});

const peter = { username: 'Peter', password: 'abc123' };

//Create a set-up to handle migrations & destruction of test DB before and after each test
beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe('server', () => {
  describe('server api working', () => {
    it('responds with string -up & running-', async () => {
      const res = await request(server).get('/');
      expect(res.body.api).toBe('up & running');
    });
  });

  describe('[POST] /register', () => {
    it('register and respond with new user', async () => {
      let res;

      res = await request(server)
        .post('/api/auth')
        .send(peter);
      expect(res).toBe({});
    });
  });
});
