const express = require('express');
const app = express();

// Set the view engine
app.set('view engine', 'ejs'); // Example with EJS
// or
// app.set('view engine', 'hbs'); // Example with Handlebars

// Specify the directory where your view templates are located
app.set('views', './views');

const globalErrHandler = (err, req, res, next) => {
    console.log(`ERROR: ${err}`);
    const statusCode = err.status || 500;
    if (req.accepts("html")) {
        /* If the client accepts HTML, send them an HTML page with the error. */
        res.status(statusCode).render("error");
    } else if (req.accepts("json")) {
        /* If the client accepts JSON, send them a JSON response.*/
        res.status(statusCode).send({ error: err });
    } else {
        /* Default to plain-text. send() will auto-convert to text. */
        res.status(statusCode).type("txt").send(statusCode);
    }
};

module.exports = globalErrHandler;