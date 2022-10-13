const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    _id : String,
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {type: mongoose.Schema.Types.String, ref: 'Genre'},
    director: {type: mongoose.Schema.Types.String, ref: 'Director'},
    imageURL: String,
    featured: Boolean
});

let userSchema = mongoose.Schema({
    _id : String,
    name: {type: String, required: true},
    password: {type:String, required: true},
    email: {type: String, required: true},
    birthday: Date,
    favoriteMovies: [{type: mongoose.Schema.Types.String, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
  
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};



let genreSchema = mongoose.Schema({
    _id : String,
    name: {type: String, required: true},
    description: {type: String, required: true}
});

let directorSchema = mongoose.Schema({
    _id : String,
    name: {type: String, required: true},
    bio: {type:String, required: true},
    birthday: Date,
    deathyear: Date
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User',userSchema);
let Genre = mongoose.model('Genre',genreSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;