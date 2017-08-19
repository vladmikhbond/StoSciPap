"use strict";
const express = require('express');
const app = express();
require('./server_ws');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'pug');

require('./routes')(app);

app.listen(8000);
console.log('Server running on 8000');

// pretty html from pug
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

