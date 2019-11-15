let dbHandler           = require("../../connection/mysql");

exports.addHtmlData     = addHtmlData;
exports.getData         = getData;
exports.updateData      = updateData;

function addHtmlData(opts){
    return new Promise((resolve, reject)=>{
        let insertObj ={};
        opts.hasOwnProperty("html")  ?    insertObj.html_data         = opts.html : 0;
        opts.hasOwnProperty("site")  ?    insertObj.website_name      = opts.site : 0;

        let sql    = "INSERT INTO tb_web_data SET ?";
        let params = [insertObj];

        dbHandler.executeQueryPromisfy(sql, params).then((result)=>{
            return resolve(result);
        }).catch((error)=>{
            return reject(error);
        });
    });
}


function getData(opts){
    return new Promise((resolve, reject)=>{
        let check = true;
        let sql    = "SELECT * FROM tb_web_data WHERE 1=1 ";
        let params = [];

        if(opts.site){
            sql += "AND website_name = ? "
            params.push(opts.site);
            check = false;
        }
        if(opts.id){
            sql +=" AND id=?";
            params.push(opts.id);
            check = false;
        }
        if(check){
            return reject("error in check");
        }
        dbHandler.executeQueryPromisfy(sql, params).then((result)=>{
            return resolve(result);
        }).catch((error)=>{
            return reject(error);
        });
    });
}

function updateData(opts, whereObj){
    return new Promise((resolve, reject)=>{
        let updateObj ={};
        opts.hasOwnProperty("html")    ? updateObj.html_data      = opts.html : 0;
        opts.hasOwnProperty("site")    ? updateObj.website_name   = opts.site : 0;
        let params=[updateObj];
        let check = true;
        let sql ="UPDATE tb_web_data SET ? WHERE 1=1";
        
        if(whereObj.id){
            sql +=" AND id =? ";
            params.push(whereObj.id);
            check = false;
        }
        if(whereObj.site){
            sql += " AND website_name = ? ";
            params.push(whereObj.site);
            check = false;
        }
        if(check){
            return reject("error in check");
        }
        dbHandler.executeQueryPromisfy(sql, params).then((result)=>{
            return resolve(result);
        }).catch((error)=>{
            return reject(error);
        });
    })
}