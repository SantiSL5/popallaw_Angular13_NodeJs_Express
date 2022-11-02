// const jwt = require('express-jwt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const secret = process.env.SECRET;

function checkAuth(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        // return req.headers.authorization.split(' ')[1];
        decrypt(req.headers.authorization.split(' ')[1]);
    }

    return null;
}

function encrypt(user) {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.TOKEN_SECRET)
}

function decrypt(token) {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    return verified;
}

// var auth = {
//     required: jwt({
//         secret: secret,
//         userProperty: 'payload',
//         getToken: getTokenFromHeader
//     }),
//     optional: jwt({
//         secret: secret,
//         userProperty: 'payload',
//         credentialsRequired: false,
//         getToken: getTokenFromHeader
//     })
// };

module.exports = auth;
