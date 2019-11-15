let mysql                            = require('mysql');

exports.rollbacktransaction          = rollbacktransaction;
exports.getConnectionForTransaction  = getConnectionForTransaction;
exports.beginTransaction             = beginTransaction;
exports.commitTransaction            = commitTransaction;
exports.executeTransaction           = executeTransaction;
exports.executeQueryPromisfy         = executeQueryPromisfy;

(function connect(){
    let con = mysql.createConnection({
        host     : "localhost",
        user     : "root",
        password : "",
        database : 'task_queue_test'
    });
    global.connection = con;
    
    connection.connect(function(err){
        if(err) { console.error(err) }
        console.log("connected to mysql database.........");
    });
})();

function getConnectionForTransaction(){
    return new Promise((resolve,reject)=>{
        return resolve(connection)
    });
}

function beginTransaction(con){
    return new Promise((resolve,reject)=>{
        con.beginTransaction(function(transError){
            if(transError){
                console.log("the transaction error is..",transError);
                return reject();
            }
            return resolve();
        });
    });
}

function commitTransaction(connect){
    return new Promise((resolve,reject)=>{
        connect.commit(function(err){
            if(err){
                console.log("the errrr",err);
                rollbacktransaction(connect).
                then(()=>{
                    return reject()
                }) .catch((ex)=>{
                    return reject(ex);
                })
            }
            return resolve();
        })
    })
}

function rollbacktransaction(conIntense){
    return new Promise((resolve,reject)=>{
        if(!conIntense){
            return reject("Unable to start Transaction");
        }
        conIntense.rollback(function(err){
            if(err){
                return reject("UNABLE TO CONNECT")
            }
            return resolve();
        });
    });
}

function executeTransaction(query,params,connect){
    return new Promise((resolve,reject)=>{
        connect.query(query, params, function(err,result){            
            if(err){
                rollbacktransaction(connect)
                .then(()=>{
                    return reject(err);
                }) .catch((ex)=>{
                    return reject(ex);
                })
            } else {
                return resolve(result);
            }
        });
    });
}

function executeQueryPromisfy(query, params){
    return new Promise((resolve,reject)=>{
        connection.query(query,params, function(err,result){
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

function createTable(){
    let sql ="CREATE TABLE IF NOT EXISTS `tb_web_data`  (`id` bigint(20) NOT NULL AUTO_INCREMENT,`html_data` longtext NOT NULL,`website_name` varchar(500) DEFAULT NULL,`current_time_stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,`update_time_stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (`id`)) ";
    executeQueryPromisfy(sql).catch((error)=>{
        console.error("error...", error)
    })
}

createTable();