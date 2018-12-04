$(function() {
  var socket = io();

  $('#loginForm').submit(function() {
    socket.emit('login', $('#name').val());
    $('.login').hide();
    $('.chat').addClass('flex');
    return false;
  });

  socket.on('login', function(user) {
    // $('#users').append($('<div class="list-group-item">').text(user));
  });

  $('#messageForm').submit(function() {
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
  });

  socket.on('chat message', function(data) {
    var messageLi = $('<li>').text(data.message);
    var userStrong = $('<span>')
      .addClass('user')
      .text(data.user);
    var dateItalic = $('<i>')
      .text(` (${moment(data.date).format('HH:mm')}) `)
      .addClass('date');
    userStrong.append(dateItalic);
    messageLi.prepend(userStrong);
    $('#messages').append(messageLi);
  });

  socket.on('users updated', function(users) {
    $('#users').html('');
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      $('#users').append($('<div class="list-group-item">').text(user));
    }
  });

  socket.on('room updates', function(data) {
    var li = $('<li>')
      .text(`${data.user} ${data.action} the room - ${moment(data.date).format('HH:mm')}`)
      .addClass('date');
    $('#messages').append(li);
  });
});
