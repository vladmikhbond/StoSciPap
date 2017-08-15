"use strict";
const express = require('express');
const app = express();
const home = require('./home');
const bodyParser = require('body-parser');

const server_ws = require('./server_ws');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', home.login_action);
app.post('/', home.hall_action);
app.post('/game', home.game_action);


app.listen(8000);
console.log('Server running on 8000');

// pretty html from pug
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

