const mysql = require('mysql')
const databaseName = 'b9aszz1ainejfniulfss'
const userName = 'ueiqnczog5zgcdjt'
const hostName = 'b9aszz1ainejfniulfss-mysql.services.clever-cloud.com'
const dialectName = 'mysql'
const password = 'dlbyOHe5q0mNy25LTmFW'

//conexão com a base de dados
const servidor = "b9aszz1ainejfniulfss-mysql.services.clever-cloud.com";
const user = "ueiqnczog5zgcdjt";
const nomedb = "b9aszz1ainejfniulfss"
const senha = "dlbyOHe5q0mNy25LTmFW"
const connection = mysql.createConnection({   
    host: servidor,
    user: user,
    password: senha,      
    database: nomedb
}) 



module.exports = connection;