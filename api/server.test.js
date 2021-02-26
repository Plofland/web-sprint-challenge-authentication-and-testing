const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

test('sanity', () => {
  expect(true).toBe(true);
});

const paul = { username: 'Paul', password: 'abc123' };

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
    it('responds with a 201 status', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send(paul);
      expect(res.status).toBe(201);
    });
    it('register and respond with new user object', async () => {
      let res;

      res = await request(server)
        .post('/api/auth/register')
        .send(paul);
      expect(res.body).toMatchObject({
        id: 1,
        username: 'Paul'
      });
    });
  });

  describe('[POST] /login', () => {
    it('responds with a 200 status', async () => {
      await request(server)
        .post('/api/auth/register')
        .send(paul);
      const res = await request(server)
        .post('/api/auth/login')
        .send(paul);
      expect(res.status).toBe(200);
    });
    it('responds with welcome string', async () => {
      //register new user then log in with them
      await request(server)
        .post('/api/auth/register')
        .send(paul);
      const res = await request(server)
        .post('/api/auth/login')
        .send(paul);
      expect(res.body.message).toContain(`Welcome`);
    });
  });

  describe('[GET] /', () => {
    it('responds with a status of 200', async () => {
      await request(server)
        .post('/api/auth/register')
        .send(paul);
      let res = await request(server)
        .post('/api/auth/login')
        .send(paul);
      const userToken = res.body.token;
      res = await request(server)
        .get('/api/jokes')
        .set({ Authorization: userToken });
      expect(res.status).toBe(200);
    });
    //⏬this test does not work when jokes are an empty array
    it('responds with array of jokes,', async () => {
      await request(server)
        .post('/api/auth/register')
        .send(paul);
      let res = await request(server)
        .post('/api/auth/login')
        .send(paul);
      const userToken = res.body.token;
      res = await request(server)
        .get('/api/jokes')
        .set({ Authorization: userToken });
      expect(res.text).toBeTruthy();
    });
    it('reponds with a status of 401 when token is invalid', async () => {
      const userToken = 'invalidToken';
      let res = await request(server)
        .get('/api/jokes')
        .set({ Authorization: userToken });
      expect(res.status).toBe(401);
    });
  });
});
