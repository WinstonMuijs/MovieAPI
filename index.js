const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid'),
morgan = require('morgan')

const app = express();

let movies = [
    {
        title: 'The Fountain',
        description: 'As a modern-day scientist, Tommy is struggling with mortality, desperately searching for the medical breakthrough that will save the life of his cancer-stricken wife, Izzi.',
        genre: {
            name: 'Drama',
            description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        director: {
            name:'Darren Aronofsky',
            bio: 'Darren Aronofsky was born February 12, 1969, in Brooklyn, New York. Growing up, Darren was always artistic: he loved classic movies and, as a teenager, he even spent time doing graffiti art. After high school, Darren went to Harvard University to study film (both live-action and animation).',
            birthyear: ' February 12, 1969 in Brooklyn, New York City, New York, USA',
            deathyear: ''
        },
        actors : ['Hugh Jackma','Rachel Weisz', 'Sean Patrick'],
        year: 2006 ,
        score: 7.2,
        rating:'PG-13',
        imageURL: 'https://www.imdb.com/title/tt0414993/mediaviewer/rm2671676416/?ref_=tt_ov_i',
        featured: true,
        length: '1h 37m'
    },
    {
        title: 'The Eternal Sunshine of the Spotless Mind ',
        description:'When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.',
        genre: {
            name: 'Drama',
            description:'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        director: {
            name: 'Michel Gondry',
            bio: 'He grew up in Versailles with a family who was very influenced by pop music. When he was young, Gondry wanted to be a painter or an inventor. In the 80s he entered in an art school in Paris where he could develop his graphic skills and where he also met friends with whom he created a pop-rock band called Oui-Oui.',
            birthyear:'May 8, 1963 in Versailles, Seine-et-Oise [now Yvelines], France',
            deathyear: ''
        },
        actors : ['Jim Carrey','Kate Winslet','Tom Wilkinson'],
        year: 2004,
        score:8.3,
        ratng:'R',
        imageURL: 'https://www.imdb.com/title/tt0338013/mediaviewer/rm2954530560/?ref_=tt_ov_i',
        featured: true,
        length: '1h 48m'
    },
    {
        title: 'The Tree of Life',
        description:'',
        genre: {
            name:'',
            description:''
        },
        director: {
            name: 'Terrence Malick',
            bio:'',
            birthyear:'',
            deathyear: ''
        },
        actors: [],
        year:'',
        score:'',
        rating:'',
        imageURL:'',
        featured: true,
        length: '2h 19m'
    },
    {
        title: '2001: Space Odyssey',
        decription:'',
        genre: {
            name: '',
            description:''
        },
        director: {
            name: 'Stanley Kubrick',
            bio:'',
            birthyear:'',
            deathyear:''
        },
        actors:[],
        year:'',
        score:'',
        rating:'',
        imageURL:'',
        featured:true,
        length: '2h 29m'
    },
    {
        title: 'Where The Wild Things Are',
        description:'',
        genre: {
            name:'',
            description:''
        },
        director: {
            name: 'Spike Jonze',
            bio:'',
            birthyear:'',
            deathyear:''
        },
        actors:[],
        year:'',
        score:'',
        rating:'',
        imageURL:'',
        featured: true,
        length: '1h 41m'
    },
    {
        title: 'Black Swan',
        description:'',
        genre: {
            name:'',
            description:''
        },
        director: {
            name:'Darren Aronofsky',
            bio:'',
            birthyear:'',
            deathyear:''
        },
        actors: [],
        year:'',
        score:'',
        rating:'',
        imageURL:'',
        featured: true,
        length: '1h 48m'
    },
    {
        title: 'Blade Runner',
        description:'',
        genre: {
            name:'',
            description:''
        },
        director: { 
            name:'Ridley Scott',
            bio:'',
            birthyear:'',
            deathyear:''
        },
        actors: [],
        year:'',
        score:'',
        rating:'',
        imageURL:'',
        featured:true,
        length: '1h 57m'
    },
    {
        title: 'Mulholland Drive',
        description:'',
        genre: {
            name:'',
            description:''
        },
        director: {
            name:'David Lynch',
            bio:'',
            birthyear:'',
            deathyear:''
        },
        actors:[],
        year:'',
        score:'',
        rating:'',
        imageURL:'',
        featured:true,
        length: '2h 27m'
    },
    {
        title: 'Moon',
        description:'',
        genre:{
            name:'',
            description:''
        },
        director: {
            name:'Duncan Jones',
            bio:'',
            birthyear:'',
            deathyear:''
        },
        actors:[],
        year:'',
        score:'',
        rating:'',
        imageURL:'',
        featured:true,
        length: '1h 37m'
    },
    {
        title: 'The Piano',
        description:'',
        genre:{
            name:'',
            description:''
        },
        director: {
            name:'Jane Campion',
            bio:'',
            birthyear:'',
            deathyear:''
        },
        actors:[],
        year:'',
        score:'',
        rating:'',
        imageURL:'',
        featured: true,
        length: '2h 01m'
    }
];

//Setup logger to terminal
app.use(morgan('common'));

//Setup express.static for documentation
app.use(express.static('public'));

//body parser
app.use(bodyParser.json());

//GET requests
app.get('/', (req, res)=>{
    res.send('Welcome to the Arthouse Movie Database!');
});

app.get('/movies', (req, res)=> {
    res.json(movies);
});

app.get('/movies/:title', (req, res) => {
    res.json(movies.find ( (movie) =>
    {return movie.title === req.params.title}));
});

app.post('/movies', (req, res) => {
    let newMovie = req.body;

    if(!newMovie.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    }else {
        newMovie.id = uuid.v4();
        movies.push(newMovie);
        res.status(201).send(newMovie);
    }

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
