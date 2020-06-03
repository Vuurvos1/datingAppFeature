# Dating app feature

This chat app is made to be a feature in a dating app. It allows users to send messages to each other in real-time and for the message to be stored inside a database.

**Screenshot form inside the app** \
<img src="https://raw.githubusercontent.com/wiki/Vuurvos1/projectTech/images/progressiveEnhancementHtmlCss.png" alt="Screenshot form chat app" width="725" >

## Installing the project

1. Make sure you have nodejs and NPM installed
2. Clone the project to your local enviroment
3. Go to folder where you saved the project
4. Run `npm install` to install the needed npm packages
5. Start the project using `node index.js`

## Note

For this project you will need my .env file \
.env structure

```
DB_HOST=host url
DB_NAME=database name
DB_USER=database username
DB_PASSWORD= database password
SECRET= secret key for sessions
```

## Database structure

### Users

| Tables     |   Type   |          Value |
| ---------- | :------: | -------------: |
| \_id       | ObjectId | auto increment |
| username   |  string  |         Moffel |
| password   |  string  |     piertje123 |
| imgFullRes |  string  |    imgFull.png |
| imgHalfRes |  string  |    imgHalf.png |

### Chats

| Tables                |   Type   |                         Value |
| --------------------- | :------: | ----------------------------: |
| \_id                  | ObjectId |                auto increment |
| participants          |  array   |        ['userId1', 'userId2'] |
| messages              |  array   |        [{message}, {message}] |
| messages[0] > sender  |  string  |                     sender id |
| messages[0] > content |  string  |                       message |
| messages[0] > time    |   date   | 2020-06-01T17:05:05.207+00:00 |

## More Documentation

Read more about the project in the [wiki](https://github.com/Vuurvos1/projectTech/wiki)

## Possible Future Features

- Message encryption
- Delete single messages

## Sources

Delgado, C. (2016, October 4). How to use Socket.IO properly with Express Framework in Node.js. Retrieved June 1, 2020, from https://ourcodeworld.com/articles/read/272/how-to-use-socket-io-properly-with-express-framework-in-node-js

MongoDB. (n.d.-a). \$in (aggregation) — MongoDB Manual. Retrieved May 31, 2020, from https://docs.mongodb.com/manual/reference/operator/aggregation/in/

MongoDB. (n.d.-b). db.collection.findOne() — MongoDB Manual. Retrieved June 1, 2020, from https://docs.mongodb.com/manual/reference/method/db.collection.findOne/

MongoDB: best design for messaging app. (2015, June 13). Retrieved May 30, 2020, from https://stackoverflow.com/questions/30823944/mongodb-best-design-for-messaging-app/30830429#30830429

Osk. (n.d.). express-socket.io-session. Retrieved June 1, 2020, from https://openbase.io/js/express-socket.io-session

Ruizendaal, R. (n.d.). RowinRuizendaal/project-tech. Retrieved June 1, 2020, from https://github.com/RowinRuizendaal/project-tech/
