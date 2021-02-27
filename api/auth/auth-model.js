const db = require('../../data/dbConfig');

const add = async (user) => {
  const [id] = await db('users').insert(user, 'id');
  return findById(id);
};

const findById = (id) => {
  return db('users as u')
    .select('u.id', 'u.username', 'u.password')
    .where('u.id', id)
    .first();
};

const findBy = (filter) => {
  return db('users as u')
    .select('u.id', 'u.username', 'u.password')
    .where(filter);
};

module.exports = {
  add,
  findBy
};
