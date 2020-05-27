const express = require('express');
const mongo = require('mongodb');
const ObjectId = mongo.ObjectID;

// const slug = require('slug')
const bodyParser = require('body-Parser');
require('dotenv').config();

const app = express();
const port = 3000;

// Data structure
// const data = [
//   {
//     id: '0001',
//     name: 'Name',
//     imgFullRes: 'img/profilePicture1x512.jpg',
//     imgHalfRes: 'img/profilePicture1x256.jpg',

//     messages: [
//       { send: 'true', message: `Hey, we matched!` },
//       { send: 'false', message: `Hey, How are you?` },
//     ],
//   },
// ];

let db;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;

mongo.MongoClient.connect(uri, function (err, client) {
  db = client.db('DatingApp');
  db.collection('Users', function (err, collection) {
    collection.find().toArray(function (err, items) {
      if (err) throw err;
      // console.log(items);
    });
  });
});

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/', sendMsg);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/index', (req, res) => {
  db.collection('Users').find().toArray(push); // promise pending

  function push(err, data) {
    if (err) console.log(err);
    console.log(data);
    res.render('index.ejs', { data: data });
  }
});

app.get('/mp4', (req, res) => {
  res.sendFile(__dirname + '/seal.mp4');
  console.log(req.headers.host + req.url);
});

app.get('*', (req, res) => {
  res.render('404.ejs');
});

// function sendMsg(req, res) {
//   const msg = {
//     send: 'true',
//     message: req.body.message,
//   };

//   data[0].messages.push(msg);

//   res.redirect('/index');
// }

// function sendMsg(req, res) {
//   db.collection('Users').insertOne({
//     send: true,
//     message: req.body.message,
//   });

//   console.log(`A new message has been send: ${req.body.message}`);
// }

function sendMsg(req, res) {
  let data = {
    send: true,
    message: req.body.message,
  };

  db.collection('Users').updateOne(
    {
      _id: ObjectId('5ecc0dbfc32afdba32b9a75e'),
    },
    { $push: { messages: data } }
  );

  // console.log(data);
  console.log(`A new message has been send: ${req.body.message}`);
  res.redirect('/index');
}
