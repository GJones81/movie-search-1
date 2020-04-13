// Load the environment variables
require('dotenv').config()

// Require needed modules
let express = require('express')
let fetch = require('node-fetch')
let db = require('./models')

// Declare a new Express app
let app = express()

// Set the template language to EJS
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

// Declare routes
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/search', (req, res) => {
    let page = req.query.page || 1
    let url = `http://www.omdbapi.com/?s=${req.query.query}&apikey=${process.env.OMDB_API_KEY}&page=${page}`

    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        res.render('results', { 
            results: data.Search, 
            query: req.query.query, 
            page: parseInt(page) 
        })
    })
    .catch(err => {
        console.log('AN error!', err)
        res.send('Error - check logs!')
    })

})

app.get('/faves', (rep,res) => {
    db.movie.findAll()
    .then(movies => {
        res.render('faves', {movies})
    })
    .catch(err => {
        console.log('Error', err)
        res.send('Uh oh!')
    })
})

app.post('/faves', (req, res) => {
    db.movie.create(req.body)
    .then(newMovie => {
        res.redirect('/faves')
    })
    .catch(err =>{
        console.log('Error')
        res.send('Uh oh!')
    })
})

// Pick a port for it to listen on
app.listen(3000)