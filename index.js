const express = require('express');
const mongo = require('mongodb');

require('dotenv').config();

// const slug = require('slug')
const bodyParser = require('body-Parser');
const app = express();
const port = 3000;

const data = [
  {
    id: '0001',
    name: 'Hanze',
    imgFullRes: 'img/profilePicture1x512.jpg',
    imgHalfRes: 'img/profilePicture1x256.jpg',

    messages: [
      {
        send: 'false',
        message: `According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is happening? - I can't. I'll pick you up. Looking sharp. Use the stairs. Your father paid good money for those.`,
      },
      { send: 'true', message: `Hey, we matched!` },
      { send: 'false', message: `Hey, How are you?` },
    ],
  },
  {
    id: '0002',
    name: 'Marielle',
    imgFullRes: 'img/profilePicture2x512.jpg',
    imgHalfRes: 'img/profilePicture2x256.jpg',

    messages: [
      {
        send: 'false',
        message: `According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is happening? - I can't. I'll pick you up. Looking sharp. Use the stairs. Your father paid good money for those.`,
      },
      { send: 'true', message: `Hey, we matched!` },
      { send: 'false', message: `Hey, How are you?` },
    ],
  },
  {
    id: '0003',
    name: 'Hanze',
    imgFullRes: 'img/profilePicture1x512.jpg',
    imgHalfRes: 'img/profilePicture1x256.jpg',

    messages: [
      {
        send: 'false',
        message: `According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is happening? - I can't. I'll pick you up. Looking sharp. Use the stairs. Your father paid good money for those.`,
      },
      { send: 'true', message: `Hey, we matched!` },
      { send: 'false', message: `Hey, How are you?` },
    ],
  },
];

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/', sendMsg);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/index', (req, res) => {
  res.render('index.ejs', { data: data });
  console.log(`${req.headers.host}/${req.url}`);
});

app.get('/mp4', (req, res) => {
  res.sendFile(__dirname + '/seal.mp4');
  console.log(req.headers.host + req.url);
});

app.get('*', (req, res) => {
  res.render('404.ejs');
});

// let db = null;
// let url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT;

// mongo.MongoClient.connect(url, function (err, client) {
//   if (err) throw err;
//   db = client.db(process.env.DB_NAME);
// });

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}-8rusk.azure.mongodb.net/test?retryWrites=true&w=majority`;

async function main() {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  // const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";

  const client = new mongo.MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await listDatabases(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log('Databases:');
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

// const client = new MongoClient(uri);

// try {
//   await client.connect();

//   await listDatabases(client);

// } catch (e) {
//   console.error(e);
// }

// mongo.connect(uri, function (err, client) {
//   if (err) {
//     console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
//   }
//   console.log('Connected...');
//   const collection = client.db(process.env.DB_NAME).collection('devices');
//   // perform actions on the collection object
//   client.close();
// });

function sendMsg(req, res) {
  const msg = {
    send: 'true',
    message: req.body.message,
  };

  data[0].messages.push(msg);

  res.redirect('/index');
}
