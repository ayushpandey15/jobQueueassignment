let request             = require("request");
let _                   = require("underscore");

let service             = require("./jobQueueServices");

exports.createJobQueue  = createJobQueue;
exports.getStatus       = getStatus;

async function createJobQueue(req, res){
try {
    let url  = req.query.url;
    let option ={
        uri : "http://" + url
    };
    request(option, async function(error, response, body){
        if(error || _.isEmpty(body)){
            console.error(error);
            return res.send({message : "error ocuured", data : {}, error : error.toString()});
        }
        let obj ={
            html : JSON.stringify(body),
            site : url
        }
        let result  = await service.getData({site : url});
        if(!_.isEmpty(result)){
            await service.updateData(obj, {site: url});
            return res.send({message : "sucessfull", status : 200, data : `Your new id for the url is ${result[0].id}` });
        }
        result = await service.addHtmlData(obj);
        return res.send({message : "sucessfull", status : 200, data : `Your new id for the url is ${result.insertId}` });

    });
    
} catch (error) {
    console.error("the errror...", error);
    return res.send({message : "error ocuured", data : {}, error : error.toString()});
}
}

async function getStatus(req, res){
    try {
        let id = req.query.id;
        let html;
        let result  = await service.getData({id : id});

        if(_.isEmpty(id)){
            return res.send({message : "NO data found", data : {}});
        }
        try {
            html = JSON.parse(result[0].html_data);
        } catch (error) {
            html = result[0].html_data;
        }
        res.set('Content-Type', 'text/html');
        return res.render(html);
    } catch (error) {
    return res.send({message : "error ocuured", data : {}, error : error.toString()});
    }
}