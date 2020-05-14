const express = require('express')
const app = express()
const port = 3000

let data = [
  {
    id: '0001',
    name: 'Hanze',
    imgFullRes: 'img/profilePicture1x512.jpg',
    imgHalfRes: 'img/profilePicture1x256.jpg',

    messages: [
        {send: 'false', message: `According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is happening? - I can't. I'll pick you up. Looking sharp. Use the stairs. Your father paid good money for those.`},
        {send: 'true', message: `Hey, we matched!`},
        {send: 'false', message: `Hey, How are you?`}
    ]
  },
  {
    id: '0002',
    name: 'Marielle',
    imgFullRes: 'img/profilePicture2x512.jpg',
    imgHalfRes: 'img/profilePicture2x256.jpg',

    messages: [
        {send: 'false', message: `According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is happening? - I can't. I'll pick you up. Looking sharp. Use the stairs. Your father paid good money for those.`},
        {send: 'true', message: `Hey, we matched!`},
        {send: 'false', message: `Hey, How are you?`}
    ]
  },
  {
    id: '0003',
    name: 'Hanze',
    imgFullRes: 'img/profilePicture1x512.jpg',
    imgHalfRes: 'img/profilePicture1x256.jpg',

    messages: [
        {send: 'false', message: `According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is happening? - I can't. I'll pick you up. Looking sharp. Use the stairs. Your father paid good money for those.`},
        {send: 'true', message: `Hey, we matched!`},
        {send: 'false', message: `Hey, How are you?`}
    ]
  }
];

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


app.get('/index', (req, res) => {
    res.render('index.ejs', {data: data});
    console.log(`${req.headers.host}/${req.url}`);
})

app.get('/mp4', (req, res) => {
    res.sendFile(__dirname + '/seal.mp4');
    console.log(req.headers.host + req.url);
})

app.get('*', (req, res) => {
    res.render('404.ejs');
})




/* Old */
// app.get('/home', (req, res) => res.sendFile(__dirname + '/index.html'))
// app.use(express.static(__dirname + ''));

// app.get('/about', (req, res) => res.send('This is the about page'))
// app.get('/contact', (req, res) => res.send('This is the contact page'))
// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
// app.get('*', (req, res) => res.send('ERROR 404'))

