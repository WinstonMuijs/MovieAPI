//Import of middleware and modeling library.
const express = require('express'),
bodyParser = require('body-parser'),

morgan = require('morgan');
// const { toInteger } = require('lodash');
const mongoose = require('mongoose');
const Models = require('./models.js');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
//Models 
const movies = Models.Movie;
const users = Models.User;


//Express-validator
const {check, validationResult} = require('express-validator')

// mongoose.connect('mongodb+srv://artmovieADMIN:hello@artmovie.uv18wvy.mongodb.net/artmovie?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true},() => {
//     console.log("connected")
// },
// e => {console.log(e)
// });

//Mongoose connecting with Heroku
mongoose.connect(process.env.CONNECTION_URI,
{
    useNewUrlParser: true, 
    useUnifiedTopology: true
},() => {
    console.log("connected");
},
e => {console.log(e);
}
);

const app = express();

//Setup logger to terminal
app.use(morgan('common'));

//Setup express.static for documentation
app.use(express.static('public'));

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Allowed domains 
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com','http://localhost:1234','https://main--verdant-stroopwafel-a5bdbc.netlify.app'];

//CORS
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

//GET all Users
app.get('/users',passport.authenticate('jwt', { session: false}), (req, res)=> {
    users.find().then((users) => {
        res.status(201).json(users);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//List of Movies
app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
    movies.find().then((movies) => {
        res.status(201).json(movies);
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


// Finding genre by name
app.get('movies/genre/:name',passport.authenticate('jwt', { session: false}), (req, res) => {
    movies.findOne({"genre.name": req.params.name}).then((movies) => {
        res.json(movies.genre)
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Finding director information by name

app.get('movies/director/:name',passport.authenticate('jwt', { session: false}), (req, res) => {
    movies.findOne({"director.name": req.params.name}).then((movies) => {
        res.json(movies.director)
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
   
    
});


// Create new user 
app.post('/users',
    [
        check('name', 'name is required').isLength({min: 5}),
        check('name', 'name contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('password', 'password is required').not().isEmpty(),
        check('email', 'email does not appear to be valid').isEmail()
    ], (req, res) => {
        let errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let hashedPassword = users.hashPassword(req.body.password); 
        users.findOne({name : req.body.name})
        .then((user) => {
            console.log(user);
            if(user){
                return res.status(400).send(req.body.name + ' already exists');
            }else{
                users.create({
                    // _id: uuidv4(),
                    name: req.body.name,
                    password: hashedPassword,
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
            res.status(500).send('Error' + error);
        });
    }
);

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
app.put('/users/:name',passport.authenticate('jwt', { session: false}),
    [
    // check('_id', 'ID is required').isIn(),
        check('name', 'name is required').isLength({min: 5}),
        check('name', 'name contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('password', 'password is required').not().isEmpty(),
        check('email', 'email does not appear to be valid').isEmail()
    ],  (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        users.findOneAndUpdate({name : req.params.name},
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
        }
);

// Create new movie to list of favorites
app.post('/users/:name/movies/:movieId',passport.authenticate('jwt', { session: false}), (req, res) => {
    users.findOneAndUpdate({name : req.params.name}, {
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
app.delete('/users/:name/movies/:movieId',passport.authenticate('jwt', { session: false}), (req, res) => {
    users.findOneAndUpdate({name : req.params.name}, {
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


//Delete user with name
app.delete('/users/:name',passport.authenticate('jwt', { session: false}), (req, res) => {
    users.findOneAndRemove({name: req.params.name})
    .then((user) => {
        if(!user){
            return res.status(400).send(req.params.name + 'was not found');
        }else {
            res.status(200).send(req.params.name + ' was deleted.');
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
  

//listen on port
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});


