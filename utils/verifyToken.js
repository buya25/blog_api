const jwt = require('jsonwebtoken');


const verifyToken = token => {
    return jwt.verify(token, process.env.JWT_KEY, (err, decoded)=> {
        if (err) throw err;
        else return decoded;
    });
}

module.exports = verifyToken;