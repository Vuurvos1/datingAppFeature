require('dotenv').config();
const bodyParser = require('body-Parser');
const mongo = require('mongodb');
const ObjectId = mongo.ObjectID;
const session = require('express-session')({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
  },
});
const cookieParser = require('cookie-parser');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const sharedsession = require('express-socket.io-session');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketio(server);

let db;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;

mongo.MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
  db = client.db('DatingApp');
  db.collection('Users', (err, collection) => {
    collection.find().toArray((err, items) => {
      if (err) throw err;
      // console.log(items);
    });
  });
});

// Express
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session);

io.use(sharedsession(session));

app.get('/chats', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  }

  const id = req.session.user._id;

  let chats = await db
    .collection('Chats')
    .find({
      participants: {
        $in: [id],
      },
    })
    .toArray();

  console.log(chats);

  if (chats.length > 0) {
    req.session.chatroom = chats[0]._id;
    chats.clientid = id;

    let x = [];
    for (let i of chats) {
      console.log(i.participants);
      if (!x.includes(i.participants[0])) {
        x.push(ObjectId(i.participants[0]));
      }

      if (!x.includes(i.participants[1])) {
        x.push(ObjectId(i.participants[1]));
      }
    }
    console.log(x);

    let users = await db
      .collection('Users')
      .find({
        _id: { $in: x },
      })
      .toArray();

    res.render('index.ejs', { data: chats, data2: users });
  } else {
    res.render('index.ejs', { data: {}, data2: {} });
  }
});

app.get('/mp4', (req, res) => {
  res.sendFile(__dirname + '/seal.mp4');
});

// switch chat
app.post('/changeChat', async (req, res) => {
  const userId = req.body.changeChat;
  const id = req.session.user._id;

  let y = [userId, req.session.user._id];

  let chats = await db
    .collection('Chats')
    .find({
      participants: {
        $all: y,
      },
    })
    .toArray();

  req.session.chatroom = chats[0]._id;
  chats.clientid = id;

  let allChats = await db
    .collection('Chats')
    .find({
      participants: {
        $in: [id],
      },
    })
    .toArray();

  let x = [];
  for (let i of allChats) {
    x.push(ObjectId(i.participants[0]));
    x.push(ObjectId(i.participants[1]));
    console.log(i.participants);
  }

  let users = await db
    .collection('Users')
    .find({
      _id: { $in: x },
    })
    .toArray();

  chats.clientid = req.session.user._id;
  res.render('index.ejs', { data: chats, data2: users });
});

// add chat
app.get('/addChat', (req, res) => {
  db.collection('Users')
    .find({})
    .toArray((err, data) => {
      if (err) {
        console.log(err);
      }

      res.render('addChat.ejs', { data: data });
    });
});

app.post('/addchat', async (req, res) => {
  const user1 = req.body.chooseUsers1;
  const user2 = req.body.chooseUsers2;

  if (user1 != user2) {
    let result = await db.collection('Chats').findOne({
      participants: {
        $all: [user1, user2],
      },
    });

    if (result) {
      console.log('chat already existst');
      res.redirect('/addChat');
    } else {
      //create chat
      console.log(`user 1: ${user1}, user 2: ${user2}`);
      db.collection('Chats').insertOne({
        participants: [user1, user2],
        messages: [],
      });

      res.redirect('/chats');
    }
  } else {
    res.redirect('/addChat');
  }
});

// Login
app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.collection('Users').findOne(
    {
      username: username.toLowerCase(),
      password: password,
    },
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        req.session.user = result;
        req.session.save((err) => {
          res.redirect('/chats');
        });
      } else {
        res.redirect('/login');
      }
    }
  );
});

// send chat msg
app.post('/chats', (req, res) => {
  if (req.body.message.trim() != '') {
    const sender = req.session.user._id;

    const databaseData = {
      sender: sender,
      content: req.body.message.trim(),
      time: new Date(),
    };

    console.log(databaseData);

    // send to database
    db.collection('Chats').updateOne(
      {
        _id: ObjectId(req.session.chatroom),
      },
      { $push: { messages: databaseData } }
    );

    console.log(`A new message has been send: ${req.body.message}`);
    res.redirect('/chats');
  }
});

app.post('/deleteChat', (req, res) => {
  const roomId = req.session.chatroom;
  db.collection('Chats').deleteOne(
    {
      _id: ObjectId(roomId),
    },
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        console.log('TACTICAL NUKE, INCOMMING ☢️');
        res.redirect('/chats');
      }
    }
  );
});

// socket io
io.on('connection', (socket) => {
  console.log(`A new client connected: ${socket.id}`);

  const socketRoom = socket.handshake.session.chatroom;
  socket.join(socketRoom);

  socket.on('message', (data) => {
    console.log('message');

    const sender = socket.handshake.session.user._id;

    const databaseData = {
      sender: sender,
      content: data.message,
      time: new Date(),
    };

    console.log(databaseData);

    // send to database
    db.collection('Chats').updateOne(
      {
        _id: ObjectId(socketRoom),
      },
      { $push: { messages: databaseData } }
    );

    socket.to(socketRoom).emit('message', data.message);
  });

  socket.on('disconnect', () => {
    console.log('Client has disconnected');
  });
});

app.get('*', (req, res) => {
  res.render('404.ejs');
});

server.listen(port, () =>
  console.log(`Dating-app listening at http://localhost:${port}`)
);
