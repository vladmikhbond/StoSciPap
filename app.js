"use strict";

const express = require('express');
const app = express();
const home = require('./home');
const bodyParser = require('body-parser');
const WebSocketServer = new require('ws');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', home.login);
app.post('/', home.hall);
app.post('/game', home.game);


app.listen(8000);
console.log('Server running on 8000');

// pretty html from pug
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

//---------------------------------------------------------------------

// подключенные клиенты
var clients = {};

// WebSocket-сервер на порту
var webSocketServer = new WebSocketServer.Server({
    port: 8001
});

webSocketServer.on('connection', function(ws) {
    console.log("новое соединение ");
    // on server
    ws.on('message', function(message) {
        console.log('получено сообщение ' + message);
        let playerName = message.split(':')[0];
        let command = message.split(':')[1];
        switch (command) {
            case 'hi':
                hi_command(playerName, ws);
                break;
            case '1':case '2':case '3':
                step_command(playerName, command, ws);
                break;

        }

    });

    ws.on('close', function() {
        console.log('соединение закрыто ' );
    });

});

function hi_command(playerName, ws) {
    // находим данного игрока в списке и сохраняем сокет
    let user = home.userByName(playerName);
    user.socket = ws;
    // находим игру с данным игроком и определяеи ее готовность
    let game = home.games.find(g => g.player1 == user || g.player2 == user);
    if (game.player1 == undefined || game.player2 == undefined) {
        ws.send("halfready");
    } else {
        game.player1.socket.send("ready");
        game.player2.socket.send("ready");
    }

}

function step_command(playerName, subj, ws) {

    // находим игру с данным игроком
    let user = home.userByName(playerName);
    let game = home.games.find(g => g.player1 == user || g.player2 == user);
    // находим индекс игрока, приславшего ход, и записываем ход
    let i = game.player1 == user ? 0 : 1;
    game.lastStep[i] = subj;
    // если оба игрока походили, запоминаем ход и отсылаем им результат
    if (game.isStepReady()) {
        game.player1.socket.send(game.lastStep.toString());
        game.player2.socket.send(game.lastStep.toString());
        game.acceptStep();
    }
}

