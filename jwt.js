const jwt = require('koa-jwt');
const SECRET = "S3cr3T~!";
const jwtInstance = jwt({secret: SECRET});
const jsonwebtoken = require('jsonwebtoken');

var JWT = {decode: jsonwebtoken.decode, sign: jsonwebtoken.sign, verify: jsonwebtoken.verify};

async function JWTErrorHandler(ctx, next) {
    var user;
    console.log("ERROR HANDLER");
    console.log(ctx.headers.authorization);
    console.log("---------------");
    console.log(ctx.status);
    //if(!ctx.headers.authorization) {
        return next().catch((err) => {
                if (401 == err.status) {
                    ctx.status = 401;
                    ctx.body = {
                        "error": "Not authorized"
                    };
                } else {
                    throw err;
                }
            });
   // }
    // else {
    //     var parts = ctx.headers.authorization.split(' ');
    //     if (parts.length == 2) {
    //         scheme = parts[0];
    //         credentials = parts[1];
    //     }
    //     if (/^Bearer$/i.test(scheme)) {
    //         token = credentials;
    //     }
    //     await JWT.verify(token, SECRET, (err, decoded) => {
    //         console.log("In here");
    //         console.log('Token');
    //         console.log(token);
    //         console.log('Error');
    //         console.log(err);
    //         console.log('Decoded');
    //         console.log(decoded);
    //         if (err) {
    //             ctx.status = 401;
    //             ctx.body = {
    //                 "error": "Not authorized"
    //             };
    //         }
    //         console.log(ctx.status);
    //     });
    //    return next();
    // }
};


 module.exports.jwt = () => jwtInstance;
// module.exports.errorHandle = () => JWTErrorHandler;

//module.exports.sign   = _JWT.sign;
module.exports.issue = (payload) => {
    return jsonwebtoken.sign(payload, SECRET);
};
module.exports.verify = jsonwebtoken.verify;
module.exports.decode = jsonwebtoken.decode;
module.exports.errorHandle = () => JWTErrorHandler;