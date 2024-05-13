//App Error

const appErr =  (status, message) => {
    const err = new Error(message);
    err.status = status ? status : 500;
    err.stack  = err.stack;
    return err;
};

//App Error
class AppErr extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = "failed";
    }
}

module.exports = {appErr, AppErr};