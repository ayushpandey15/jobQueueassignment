let validator     = require("./jobQueueValidator");
let controller    = require("./jobQueueController");

app.get("/create",  validator.createJobQueue, controller.createJobQueue);
app.get("/getStatus", validator.getStatus, controller.getStatus);
app.get("/get",function(req, res){
    return res.status(200).send("ping");
})