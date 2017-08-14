
const WebSocketServer = new require('ws');
const home = require('./home');

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
            case '1':
            case '2':
            case '3':
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
        let json = JSON.stringify({
            "command": "halfready",
            "name1": game.player1.name,
        });
        ws.send(json);
    } else {
        game.player1.socket.send(JSON.stringify({
            "command": "ready",
            "name1": game.player1.name,
            "name2": game.player2.name,
        }));
        game.player2.socket.send(JSON.stringify({
            "command": "ready",
            "name1": game.player2.name,
            "name2": game.player1.name,
        }));
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
        game.acceptStep();
        let data = {
            "command": "step",
            "steps": game.steps,
            "score": game.getScore(),
        };
        game.player1.socket.send(JSON.stringify(data));
        reverse(data);
        game.player2.socket.send(JSON.stringify(data));
    }

    function reverse(d) {
        for (let i = 0; i < d.steps.length; i++) {
            d.steps[i].reverse();
        }
        d.score.reverse();
    }

}

