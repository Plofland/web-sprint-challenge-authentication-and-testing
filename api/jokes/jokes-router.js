// do not make changes to this file
const router = require('express').Router();
const { restrict } = require('../middleware/restricted');
const jokes = require('./jokes-data');

router.get('/', restrict, (req, res) => {
  res.status(200).json(jokes);
});

module.exports = router;
