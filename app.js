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

// app.use(function (req, res, next) {
//     if (!req.session.views) {
//         req.session.views = {};
//     }
//
//     // get the url pathname
//     let pathname = parseurl(req).pathname;
//
//     // count the views
//     req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
//
//     next()
// })



app.listen(8000);
console.log('Server running on 8000');

// pretty html from pug
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

