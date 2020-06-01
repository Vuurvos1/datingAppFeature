require('dotenv').config();
const bodyParser = require('body-Parser');
const mongo = require('mongodb');
const ObjectId = mongo.ObjectID;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
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

/* Express */
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/chats', sendMsg);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
    },
  })
);

app.get('/chats', (req, res) => {
  // console.log(`chats session user: ${req.session.user}`);

  if (!req.session.user) {
    res.redirect('/login');
  }

  const id = req.session.user._id;
  console.log(`chats user _id: ${id}`);

  db.collection('Chats')
    .find({
      participants: {
        $in: [req.session.user._id],
      },
    })
    .toArray((err, data) => {
      if (err) console.log(err);
      data.clientid = id;
      console.log(data);
      res.render('index.ejs', { data: data });
    });
});

app.get('/mp4', (req, res) => {
  res.sendFile(__dirname + '/seal.mp4');
  // console.log(req.headers.host + req.url);
});

// Login
app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let user = {
    username: username.toLowerCase(),
    password: password,
  };

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
        req.session.save(function (err) {
          res.redirect('/chats');
        });
      } else {
        res.redirect('/login');
      }
    }
  );
});

/* Database */
function sendMsg(req, res) {
  if (req.body.message.trim() != '') {
    let data = {
      send: true,
      message: req.body.message.trim(),
    };

    db.collection('Users').updateOne(
      {
        _id: ObjectId('5ecc0dbfc32afdba32b9a75e'),
      },
      { $push: { messages: data } }
    );

    console.log(`A new message has been send: ${req.body.message}`);
    res.redirect('/');
  }
}

/* Socket io */
io.on('connection', (socket) => {
  console.log(`A new client connected: ${socket.id}`);
  let roomName;

  socket.on('joinRoom', (room) => {
    roomName = room;
    socket.join(room);
  });

  // roomName = socket.id;
  // socket.join(roomName);

  socket.on('message', (data) => {
    console.log(data.message);

    if (data.message.trim() != '') {
      let databaseData = {
        sender: '5ecc2c45c32afdba32b9a760',
        content: 'Doing great!',
        time: new Date(),
      };

      db.collection('Chats').updateOne(
        {
          _id: ObjectId('5ecc0dbfc32afdba32b9a75e'),
        },
        { $push: { messages: databaseData } }
      );

      console.log(`A new message has been send: ${databaseData}`);
      // res.redirect('/');
    }
    // add to database

    socket.to(roomName).emit('message', data.message);
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
