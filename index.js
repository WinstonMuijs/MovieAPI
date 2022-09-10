const express = require('express'),
bodyParser = require('body-parser'),
// uuid = require('uuid'),
morgan = require('morgan');
const { toInteger } = require('lodash');
const mongoose = require('mongoose');
const Models = require('./models.js');
const cors = require('cors');

const movies = Models.Movie;
const users = Models.User;
const genres = Models.Genre;
const directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/[artHouseDB]',{useNewUrlParser: true, useUnifiedTopology: true},() => {
    console.log("connected")
},
e => {console.log(e)
});


const app = express();

//Setup logger to terminal
app.use(morgan('common'));

//Setup express.static for documentation
app.use(express.static('public'));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
    origin: (origin, callback) => {
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
        let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
        return callback(new Error(message ), false);
      }
      return callback(null, true);
    }
}));

//import of auth.js
let auth = require('./auth')(app);

//import passport.js
const passport = require('passport');
require('./passport');

//GET requests
app.get('/', (req, res)=>{
    res.send('Welcome to the Arthouse Movie Database!');
});

//List of Users
app.get('/users',passport.authenticate('jwt', { session: false}), (req, res)=> {
    users.find().then((users) => {
        res.status(201).json(users);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//List of Movies
app.get('/movies',passport.authenticate('jwt', { session: false}), (req, res)=> {
    movies.find().then((movies) => {
        res.status(201).json(movies);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//List of genres
app.get('/genres',passport.authenticate('jwt', { session: false}), (req, res)=> {
    genres.find().then((genres) => {
        res.status(201).json(genres);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Movie by ID
app.get('/movies/:movieId',passport.authenticate('jwt', { session: false}), (req, res) => {
    movies.findOne({_id: req.params.movieId}).then((movie) => {
        res.json(movie)
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Info about Genre
app.get('/genres/:genreId',passport.authenticate('jwt', { session: false}), (req, res) => {
    genres.findOne({_id: req.params.genreId}).then((genre) => {
        res.json(genre)
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Finding director information

app.get('/directors/:directorId',passport.authenticate('jwt', { session: false}), (req, res) => {
    directors.findOne({_id: req.params.directorId}).then((director) => {
        res.json(director)
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
   
    
});


// Create new user 
app.post('/users', (req, res) => {
   let hashPassword = users.hashPassword(req.body.password); 
   users.findOne({name : req.body.name})
    .then((user) => {
        if(user){
            return res.status(400).send(req.body.name + ' already exists');
        }else{
            users.create({
                _id: req.body._id,
                name: req.body.name,
                password: hashPassword,
                email: req.body.email,
                birthday: req.body.birthday,
                favoriteMovies: req.body.favoriteMovies
            }).then((user) =>{res.status(201).json(user)})
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error:' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.stutas(500).send('Error' + error);
    });
});

//Find a user with name
app.get('/users/:name',passport.authenticate('jwt', { session: false}), (req, res) => {
    users.findOne({name: req.params.name
    })
    .then((user) => {
        res.json(user);
    }).catch((err) => {
        console.error(err);
    res.status(500).send('Error: ' + err);
    });
});

// Updates username
app.put('/users/:userId',passport.authenticate('jwt', { session: false}), (req, res) => {
    users.findOneAndUpdate({_id : req.params.userId},
        {$set: 
            {
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                birthday: req.body.birthday,
                favoriteMovies: req.body.favoriteMovies
            }
        },
        {new: true},
        (err, updatedUser) => {
            if(err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            }else {
                res.json(updatedUser);
            }
        });
    });

// Create new movie to list of favorites
app.post('/users/:userId/favoriteMovies/:movieId',passport.authenticate('jwt', { session: false}), (req, res) => {
    users.findOneAndUpdate({_id : req.params.userId}, {
        $push: {favoriteMovies : req.params.movieId}
    },
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        }else {
            res.json(updatedUser);
        }
    });
});

//Delete a movie fom list of favorites
app.delete('/users/:userId/favoriteMovies/:movieId',passport.authenticate('jwt', { session: false}), (req, res) => {
    users.findOneAndUpdate({_id : req.params.userId}, {
        $pull: {favoriteMovies : req.params.movieId}
    },
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        }else {
            res.json(updatedUser);
        }
    });
});


//Delete user with email
app.delete('/users/:email',passport.authenticate('jwt', { session: false}), (req, res) => {
    users.findOneAndRemove({email: req.params.email})
    .then((user) => {
        if(!user){
            return res.status(400).send(req.params.email + 'was not found');
        }else {
            res.status(200).send(req.params.email + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
    });
});


//Error Handling 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
  

//listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
