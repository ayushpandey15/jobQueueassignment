let express                 = require('express');
let bodyParser              = require('body-parser');

app  = express();
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

require("./connection/mysql");
require("./module");

let server = require('http').createServer(app);
let PORT = 3000 || process.env.PORT;


server.listen(PORT,()=>{
    console.log("the server is listening on .......",PORT);
});