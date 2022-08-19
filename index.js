const express = require('express'),
morgan = require('morgan'),
fs = require('fs'),
path = require('path');

const app = express();

const accesLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})


let top10ArthouseMovies = [
    {
        title: 'The Fountain',
        director: 'Darren Aronofsky',
        length: '1h 37m'
    },
    {
        title: 'The Eternal Sunshine of the Spotless Mind ',
        director: 'Michel Gondry',
        length: '1h 48m'
    },
    {
        title: 'The Tree of Life',
        director: 'Terrence Malick',
        length: '2h 19m'
    },
    {
        title: '2001: Space Odyssey',
        director: 'Stanley Kubrick',
        length: '2h 29m'
    },
    {
        title: 'Where The Wild Things Are',
        author: 'Spike Jonze',
        length: '1h 41m'
    },
    {
        title: 'Black Swan',
        director: 'Darren Aronofsky',
        length: '1h 48m'
    },
    {
        title: 'Blade Runner',
        director: 'Ridley Scott',
        length: '1h 57m'
    },
    {
        title: 'Mulholland Drive',
        director: 'David Lynch',
        length: '2h 27m'
    },
    {
        title: 'Moon',
        director: 'Duncan Jones',
        length: '1h 37m'
    },
    {
        title: 'The Piano',
        author: 'Jane Campion',
        length: '2h 01m'
    }
];

//Setup the logger
app.use(morgan('combined', {stream: accesLogStream}));

//Setup express.static for documentation
app.use(express.static('public'));

//GET requests
app.get('/', (req, res)=>{
    res.send('Welcome to the Arthouse Movie Database!');
});

app.get('/movies', (req, res)=> {
    res.json(top10ArthouseMovies);
});

//Error Handling 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
  

//listen for requests
app.listen(8080, ()=>{
    console.log('Your app is listening on port 8080.');
})
