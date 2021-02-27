const Users = require('../auth/auth-model');

const checkPayload = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json('username and password required');
  } else {
    next();
  }
};

const checkUserInDb = async (req, res, next) => {
  try {
    const rows = await Users.findBy({
      username: req.body.username
    });
    if (!rows.length) {
      next();
    } else {
      res.status(401).json('username taken');
    }
  } catch (err) {
    res.status(500).json(`Server error: ${err}`);
  }
};

const checkUserExists = async (req, res, next) => {
  try {
    const rows = await Users.findBy({
      username: req.body.username
    });
    if (rows.length) {
      req.userData = rows[0];
      next();
    } else {
      res
        .status(401)
        .json('invalid credentials');
    }
  } catch (error) {
    res.status(500).json(`Server error: ${err}`);
  }
};

module.exports = {
  checkUserExists,
  checkPayload,
  checkUserInDb
};
