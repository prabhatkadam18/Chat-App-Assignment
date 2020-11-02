const socket = io('ws://localhost:3001');

var name = document.getElementById('name').innerHTML;
var avatarId = document.getElementById('avatarid').innerHTML;
var messageArea  = document.getElementById('message-area');

function handleSend(event){
  var msgtxt = document.getElementById('input').value.trim();
  if(msgtxt !== ''){
    if(event.which === 13){
      var message = {};
      message.text = msgtxt;
      var d = new Date();
      var h = d.getHours();
      var m = d.getMinutes();
      if(m/10 < 1){
        m= '0'+ m.toString();
      }
      message.time = h + ':' + m;
      document.getElementById('input').value = "";
      socket.emit('sendMessage', message);
    }
  }
}

function appendMessage(message){

  var outerDiv = document.createElement('div');

  var wrapper = document.createElement('div');
  wrapper.classList.add('message', 'incoming');

  var msgText = document.createElement('p');
  msgText.innerHTML = message.text;
  var owner = document.createElement('h4');
  
  owner.innerHTML = document.getElementById('owner').innerHTML;
  var time = document.createElement('div');
  time.classList.add('time');
  time.innerHTML = message.time;

  wrapper.appendChild(owner);
  wrapper.appendChild(msgText);
  wrapper.appendChild(time);

  outerDiv.appendChild(wrapper);
  var avatarImg = document.createElement('img');
  avatarImg.classList.add('msgAvatar');
  avatarImg.src = `/avatars/${avatarId}.png`;

  outerDiv.appendChild(avatarImg);
  messageArea.appendChild(outerDiv);
  
}

function exitRoom(){
  socket.emit('leaveRoom', {id: socket.id, name});
}

socket.on('home', (res)=>{
  if( res == name){
    location.href= '/';
  }
})

socket.on('avatarRedirect', () => {
  window.location = '/avatar/' + name;
});

socket.on('newMessage', message => {
  appendMessage(message);
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight
}