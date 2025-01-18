const bcrypt = require('bcrypt');

bcrypt.hash('password123', 10)
  .then(hash => {
    console.log('Hashed Password:', hash);
  })
  .catch(err => {
    console.error('Error:', err);
  });