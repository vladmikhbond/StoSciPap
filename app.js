"use strict";
const express = require('express');
const app = express();
require('./sockets/server_ws');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const sesion = require('express-session');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sesion({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

require('./routes')(app);

const PORT = 8000;
app.listen(PORT);

console.log('Server running on ' + PORT);

// pretty html from pug
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

