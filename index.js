const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


app.get('/index', (req, res) => {
    res.render('index.ejs');
    console.log(`${req.headers.host}/${req.url}`);
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

// app.get('/inloggen', (req, res) => {
//     res.render('inloggen.ejs');
// })