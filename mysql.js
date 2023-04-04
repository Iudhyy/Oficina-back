const mysql =require("mysql");

var pool =mysql.createPool({
    "user":"oficina_user",
    "password":"@#oficina@#",
    "database":"oficinanova",
    "host":"10.1.2.155",
    "port":3306

});

exports.pool=pool;