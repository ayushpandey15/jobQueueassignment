let Joi      = require("joi");

exports.createJobQueue   = createJobQueue;
exports.getStatus        = getStatus;

function createJobQueue(req, res, next){
    let schema = Joi.object().keys({
        url : Joi.string().required()
    });
    var validFields = validateFields(req.query, res, schema);
    if (validFields) {
      next();
    }
}

function getStatus(req, res, next){
    let schema = Joi.object().keys({
        id : Joi.any().required()
    });
    var validFields = validateFields(req.query, res, schema);
    if (validFields) {
      next();
    }
}


function validateFields(req, res, schema, url) {
    console.log({ REQUEST_BODY: req});
    var validation = Joi.validate(req, schema);
    if(validation.error) {
      var errorReason =
            validation.error.details !== undefined
              ? validation.error.details[0].message
              : 'Parameter missing or parameter type is wrong';
      console.error(validation.error.details);
      res.send({message : "error", status: 201, data : validation.error.details[0].message})
      return false;
    }
    return true;
  }