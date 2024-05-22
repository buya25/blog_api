const getTokenFromHeaders = req => {
    // Get token from headers
    const headerObj = req.headers;

    // Check if the 'authorization' header is present
    if (!headerObj['authorization']) {
        throw new Error('User should login again');
    }

    // Split the 'authorization' header to get the token
    const parts = headerObj['authorization'].split(' ');

    // Check if the header format is correct
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new Error('User should login again');
    }

    const token = parts[1];

    // Check if the token is undefined or null
    if (!token) {
        throw new Error('User should login again');
    }
    
    return token;
};

module.exports = getTokenFromHeaders;