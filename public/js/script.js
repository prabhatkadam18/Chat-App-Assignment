const socket = io('ws://localhost:3000');

var name = document.getElementById('name').innerHTML;
var msgBox  = document.getElementById('messageBox');

function appendMessage(message){
  var wrapper = document.createElement('div');
  wrapper.classList.add('message-wrapper');
  var msgText = document.createElement('p');
  msgText.classList.add('message-text', 'card');
  var time = document.createElement('div');
  time.classList.add('time');

  msgText.innerHTML = message.text;
  time.innerHTML = message.time;

  wrapper.appendChild(msgText);
  wrapper.appendChild(time);

  msgBox.appendChild(wrapper);
}

function sendMessage(){
  var message = {};
  message.text = document.getElementById('textarea').value;
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  if(m/10 < 1){
    m= '0'+ m.toString();
  }
  message.time = h + ':' + m;
  document.getElementById('textarea').value ="";
  socket.emit('sendMessage', message);
}

function exitRoom(){
  socket.emit('deleteRoom');
}


socket.on('avatarRedirect', () => {
  window.location = '/avatar/' + name;
});

socket.on('newMessage', message => {
  appendMessage(message);
});

