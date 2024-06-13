const knex = require('knex')({
    client: 'mysql',
    connection: {
        host:"localhost", 
        port:'3306',
        user:'root',
        password:'pass1234',
        database:'cloth',
        multipleStatements: true,
    }
});

module.exports={
    knex,
}