const passport = require('passport'),
localStrategy = require('passport-local').Strategy,
Models = require('./models.js'),
passportJWT = require('passport-jwt');

let users = Models.User,
JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;

passport.use(new localStrategy({
    usernameField: 'name',
    passwordField: 'password'
}, (name, password, callback) => {
    console.log(name + '  ' + password);
    users.findOne({name: name}, (error, user) => {
        if(error) {
            console.log(error);
            return callback(error);
        }
        if(!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username or password'});
        }
        console.log('finished');
        return callback(null, user);
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayLoad, callback) => {
    return users.findById(jwtPayLoad._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));