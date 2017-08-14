"use strict";

var socket = new WebSocket("ws://localhost:8001");
socket.onopen = function() {
    socket.send(myName + ':hi');
}

// on client
socket.onmessage = function(event) {
    alert("Получены данные " + event.data);
    if (event.data == 'ready') {
        $("#panel").css('display', 'block');
        $("#message").css('display', 'none');
    }
    if (event.data == 'halfready') {
        $("#panel").css('display', 'none');
        $("#message").css('display', 'block');
    }
}


socket.onclose = function(event) {
    if (event.wasClean) {
        alert('Соединение закрыто чисто');
    } else {
        alert('Обрыв соединения'); // например, "убит" процесс сервера
    }
    alert('Код: ' + event.code + ' причина: ' + event.reason);
}

socket.onerror = function(error) {
    alert("Ошибка " + error.message);
}

function step() {
    let subj = $('input[name=subj]:checked').val();
    socket.send(myName + ':' + subj);
}