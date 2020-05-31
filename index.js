require('dotenv').config();
const bodyParser = require('body-Parser');
const mongo = require('mongodb');
const ObjectId = mongo.ObjectID;
// // const slug = require('slug')

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

// let server = app.listen(process.env.PORT || port, listen);

// let roomname = '';

/* Express */
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: true }));
app.post('', sendMsg);

app.get('', (req, res) => {
  db.collection('Users')
    .find()
    .toArray((err, data) => {
      if (err) console.log(err);
      // console.log(data);
      res.render('index.ejs', { data: data });
    });
});

app.get('/mp4', (req, res) => {
  res.sendFile(__dirname + '/seal.mp4');
  // console.log(req.headers.host + req.url);
});

app.get('*', (req, res) => {
  res.render('404.ejs');
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

  socket.on('message', (data) => {
    console.log(data.message);

    // let data2 = {
    //   name: '🦐',
    //   message: data.message,
    // };

    if (data.message.trim() != '') {
      let DatabaseData = {
        send: true,
        message: data.message.trim(),
      };

      db.collection('Users').updateOne(
        {
          _id: ObjectId('5ecc0dbfc32afdba32b9a75e'),
        },
        { $push: { messages: DatabaseData } }
      );

      console.log(`A new message has been send: ${DatabaseData}`);
      // res.redirect('/');
    }
    // add to database

    // socket.to(roomName).emit('message', data2);
  });

  socket.on('disconnect', () => {
    console.log('Client has disconnected');
  });
});

server.listen(port, () =>
  console.log(`Dating-app listening at http://localhost:${port}`)
);
