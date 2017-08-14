"use strict";

var socket = new WebSocket("ws://localhost:8001");
socket.onopen = function() {
    socket.send(myName + ':hi');
}

// on client
socket.onmessage = function(event) {
    let data = JSON.parse(event.data);

    switch (data.command) {
        case 'halfready':
            $("#message").css('display', 'block');
            break;
        case 'ready':
            $("#panel").css('display', 'block');
            $("#message").css('display', 'none');
            $("#header").html(data.name1 + " vs " + data.name2);
            break;
        case "step":   // show current game state
            let subj = ["", "Камень", "Ножницы", "Бумага"];
            $("#steps").empty();
            for (let i = 0; i < data.steps.length; i++) {
                let a = subj[data.steps[i][0]];
                let b = subj[data.steps[i][1]];
                $("#steps").append($("<li> " + a + " vs " + b + "</li>"));
            }
            $("#score").html(data.score[0] + " : " + data.score[1]);
            break;
    }
}


socket.onclose = function(event) {
    if (event.wasClean) {
        alert('Соединение закрыто чисто');
    } else {
        //alert('Обрыв соединения'); // например, "убит" процесс сервера
    }
    //alert('Код: ' + event.code + ' причина: ' + event.reason);
}

socket.onerror = function(error) {
    alert("Ошибка " + error.message);
}

// player pushed 'Step' button
function do_step() {
    let subj = $('input[name=subj]:checked').val();
    socket.send(myName + ':' + subj);
}