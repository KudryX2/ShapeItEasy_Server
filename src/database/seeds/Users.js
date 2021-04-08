const BCRYPT = require('bcrypt');

exports.seed = function(knex, Promise) {
    return knex('users').del()                  // Deletes ALL existing entries

    .then(function () {

        return knex('users').insert([           // Inserts seed entries
        {
            name: 'kudry',
            email: 'kudry',
            password: BCRYPT.hashSync('pato' , 10)
        }
        ]);
    });
    
};