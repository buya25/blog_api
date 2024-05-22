const jwt = require('jsonwebtoken');

const generateToken =  (user) => {
    //we are generating token and making it valid for 7 days
    return jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '7d' });
}

module.exports = generateToken;