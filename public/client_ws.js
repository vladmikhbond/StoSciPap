"use strict";

// -------------- ws suit --------------------

const socket = new WebSocket("ws://localhost:5558");
socket.onopen = function() {
    socket.send(myName + ':hi');
};

// on client
socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    let $message = $("#message");
    let $steps = $("#steps");

    switch (data.command) {
        case 'halfready':
            $message.css('display', 'block')
                .html('Игра начнется, как только появится партнер.');
            break;
        case 'ready':
            $("#panel").css('display', 'block');
            $message.css('display', 'none');
            $("#header").html(data.name1 + " -vs- " + data.name2);
            break;
        case "step":   // show current game state
            let subj = ["", "Камень", "Ножницы", "Бумага"];
            $steps.empty();
            for (let i = 0; i < data.steps.length; i++) {
                let a = subj[data.steps[i][0]];
                let b = subj[data.steps[i][1]];
                $steps.append($("<li> " + a + " -vs- " + b + "</li>"));
            }
            $("#score").html(data.score[0] + " : " + data.score[1]);

            // game is over
            if (data.winner) {
                $("#step-panel").css('display', 'none');
                let mes = data.score[0] === data.score[1] ? "Ничья" :
                    data.winner === myName ? "Вы победили!" : "Вы проиграли.";
                $message.css('display', 'block')
                    .html('<a href="/"> Игра окончена. ' + mes + '</a>');
            }
            break;
    }
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log('Соединение закрыто чисто');
    } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
    }
    console.log('Код: ' + event.code + ' причина: ' + event.reason);
};

socket.onerror = function(error) {
    console.log("Ошибка " + error.message);
};

// -------------- event handlers --------------------

$(function() {
    $('#step-button').on('click', function() {
        let subj = $('input[name=subj]:checked').val();
        socket.send(myName + ':' + subj);
    });
})