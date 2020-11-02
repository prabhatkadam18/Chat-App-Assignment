const socket = io('ws://localhost:3001');

const name = document.getElementById('name').innerHTML;
console.log(name);

function selectavatar(id) {
  socket.emit('createRoom', { owner: name, avatarId: id });
}

socket.on('roomCreated', ()=>{
  location.href = '/chatroom/' + name;
})

socket.on('chat', () => {
  location.href = '/chatroom/' + name;
});