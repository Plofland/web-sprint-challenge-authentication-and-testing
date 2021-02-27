const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secrets');
const Users = require('./auth-model');
const {
  checkPayload,
  checkUserInDb,
  checkUserExists
} = require('../middleware/middleware');


router.post(
  '/register',
  checkPayload,
  checkUserInDb,
  async (req, res) => {
    try {
      const hash = bcryptjs.hashSync(req.body.password, 10);
      const newUser = await Users.add({
        username: req.body.username,
        password: hash
      });
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
    /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  }
);

router.post('/login', checkUserExists, (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username: username })
    .then(([user]) => {
      if (
        user &&
        bcryptjs.compareSync(password, user.password)
      ) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome, ${user.username}`,
          token
        });
      } else {
        res
          .status(401)
          .json({ message: 'Invalid credentials' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});
/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */


const generateToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: '3h'
  };
  return jwt.sign(payload, jwtSecret, options);
};

module.exports = router;
