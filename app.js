const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set("views", __dirname + '/views');


var server = app.listen(process.env.PORT || PORT , ()=>{
  console.log("Server started on port: "+ PORT);
});
const io = socketIO(server);

var messages = [];
var members = [];
var roomCreated = false;
var currentOwner = null;
var ownerID = null;
var ownerAvatar = null;

io.on('connection', (socket) => {
  console.log("New Connection");
 
  socket.on('createRoom', room =>{
    roomCreated = true;
    currentOwner = room.owner;
    ownerAvatar = room.avatarId;
    io.emit('roomCreated');
    io.emit('chat');
  });

  socket.on('deleteRoom', () => {
    roomCreated = false;
    members = members.filter( member => member !== currentOwner);
    currentOwner = null;
    ownerID = null;
    ownerAvatar = null;
    messages = [];
    io.emit('avatarRedirect');
  });

  socket.on('sendMessage', message =>{
    messages.push(message);
    io.emit('newMessage', message);
  })

  socket.on('disconnect', () => {
    console.log('User Left');
  });
});


function avatarMiddleware(req, res, next) {
  if(!members.includes(req.params.name)){
    res.redirect('/');
  } else if(!roomCreated) {
    next();
  } else {
    res.redirect('/chatroom/' + req.params.name);
  }
}

function chatroomMiddleware(req, res, next) {
  if(!members.includes(req.params.name)){
    res.redirect('/');
  } else if(roomCreated) {
    next();
  } else {
    res.redirect('/avatar/' + req.params.name);
  }
}


app.get('/', (req, res)=>{
  return res.render('index');
});

app.post('/adduser', (req, res)=>{
  var name = req.body.name.trim();
  if( !foundName (name)){
    members.push(name);
    res.send("OK");
  } else {
    res.send("BAD");
  }
 
})

app.get('/avatar/:name', avatarMiddleware, (req, res)=>{
  res.render('avatar',{name: req.params.name});
});

app.post('/setavatar', (req, res)=>{
  if( currentOwner!= null){
    var avatarId = req.body.id;
    ownerAvatar = avatarId;
    res.send(currentOwner);
  } else {
    res.send('bad');
  }
})

app.get('/chatroom/:name',chatroomMiddleware, (req, res)=>{
  if( currentOwner!= null ){
    var isOwner = req.params.name == currentOwner ? true: false;
    res.render('chatroom', {name: req.params.name, owner: currentOwner, ownerAvatar, messages, isOwner});
  } else {
    res.redirect('/');
  }
})

function foundName(name){
  var found = members.find((member)=> member === name);
  if(found){
    return true;
  } return false;
}

