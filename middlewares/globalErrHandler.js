const express = require('express');
const app = express();

// Set the view engine
app.set('view engine', 'ejs'); // Example with EJS
// or
// app.set('view engine', 'hbs'); // Example with Handlebars

// Specify the directory where your view templates are located
app.set('views', './views');

//i want my error handler to only display context in json format
const globalErrHandler = ((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: err.message });
    });

module.exports = globalErrHandler;