const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid'),
morgan = require('morgan')

const app = express();

let users = [
    {
        id : 1,
        name: 'Winston',
        email: 'whmuijs@gmail.com',
        favoriteMovies : []
    },
    {
        id : 2,
        name : 'Bo',
        email : 'bo@gmail.com',
        favoriteMovies : ['Moon']
    }
];

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
            birthyear: 'February 12, 1969 in Brooklyn, New York City, New York, USA',
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
        description:'The story of a family in Waco, Texas in 1956. The eldest son witnesses the loss of innocence and struggles with his parents conflicting teachings.',
        genre: {
            name:'Drama',
            description:'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        director: {
            name: 'Terrence Malick',
            bio:'Terrence Malick was born in Ottawa, Illinois. His family subsequently lived in Oklahoma and he went to school in Austin, Texas. He did his undergraduate work at Harvard, graduating summa cum laude with a degree in philosophy in 1965.',
            birthyear:'November 30, 1943 in Ottawa, Illinois, USA',
            deathyear: ''
        },
        actors: ['Brad Pitt', 'Sean Penn', 'Jessica Chastain'],
        year: 2011,
        score:6.8,
        rating:'PG-13',
        imageURL:'https://www.imdb.com/title/tt0478304/mediaviewer/rm4192437504/?ref_=tt_ov_i',
        featured: true,
        length: '2h 19m'
    },
    {
        title: '2001: Space Odyssey',
        decription:'After uncovering a mysterious artifact buried beneath the Lunar surface, a spacecraft is sent to Jupiter to find its origins - a spacecraft manned by two men and the supercomputer H.A.L. 9000.',
        genre: {
            name: 'Adventure',
            description:'An adventure film is a form of adventure fiction, and is a genre of film. Subgenres of adventure films include swashbuckler films, pirate films, and survival films. Adventure films may also be combined with other film genres such as action, animation, comedy, drama, fantasy, science fiction, family, horror, or war.'
        },
        director: {
            name: 'Stanley Kubrick',
            bio:'Stanley Kubrick was born in Manhattan, New York City, to Sadie Gertrude (Perveler) and Jacob Leonard Kubrick, a physician. His family were Jewish immigrants (from Austria, Romania, and Russia). Stanley was considered intelligent, despite poor grades at school. ',
            birthyear:'July 26, 1928 in New York City, New York, USA',
            deathyear:'March 7, 1999 (age 70) in Harpenden, Hertfordshire, England, UK'
        },
        actors:['Keir Dullea', 'Gary Lockwood', 'William Sylvester', 'Daniel Richter'],
        year: 1968,
        score: 8.3,
        rating:'PG',
        imageURL:'https://www.imdb.com/title/tt0062622/mediaviewer/rm3872284416/?ref_=tt_ov_i',
        featured:true,
        length: '2h 29m'
    },
    {
        title: 'Where The Wild Things Are',
        description:'Yearning for escape and adventure, a young boy runs away from home and sails to an island filled with creatures that take him in as their king.',
        genre: {
            name:'Family',
            description:'Family film, is a film genre that contains children or relates to them in the context of home and family.'
        },
        director: {
            name: 'Spike Jonze',
            bio:'Spike Jonze made up one-third (along with Andy Jenkins and Mark Lewman) of the triumvirate of genius minds behind Dirt Magazine, the brother publication of the much lamented ground-breaking Sassy Magazine. These three uncommon characters were all editors for Grand Royal Magazine as well, under the direction of Mike D and Adam Horovitz and Adam Yauch before the sad demise of Grand Royal Records. Jonze was also responsible for directing the famous Beastie Boys: Sabotage (1994) short film as well as numerous other music videos for various artists.',
            birthyear:'October 22, 1969 in Rockville, Maryland, USA',
            deathyear:''
        },
        actors:['Max Records', 'Catherine O\'Hara', 'Forest Whitaker'],
        year: 2009,
        score: 6.7,
        rating:'PG',
        imageURL:'https://www.imdb.com/title/tt0386117/mediaviewer/rm2173864192/?ref_=tt_ov_i',
        featured: true,
        length: '1h 41m'
    },
    {
        title: 'Black Swan',
        description:'A committed dancer struggles to maintain her sanity after winning the lead role in a production of Tchaikovsky\'s "Swan Lake".',
        genre: {
            name:'Drama',
            description:'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        director: {
            name:'Darren Aronofsky',
            bio:'Darren Aronofsky was born February 12, 1969, in Brooklyn, New York. Growing up, Darren was always artistic: he loved classic movies and, as a teenager, he even spent time doing graffiti art. After high school, Darren went to Harvard University to study film (both live-action and animation).',
            birthyear:'ebruary 12, 1969 in Brooklyn, New York City, New York, USA',
            deathyear:''
        },
        actors: ['Nathalie Portman', 'Mila Kunis', 'Vincent Cassel'],
        year: 2010,
        score: 8.0,
        rating:'PG-13',
        imageURL:'https://www.imdb.com/title/tt0947798/mediaviewer/rm1503101184/?ref_=tt_ov_i',
        featured: true,
        length: '1h 48m'
    },
    {
        title: 'Blade Runner',
        description:'A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.',
        genre: {
            name:'Action',
            description:'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats. The genre tends to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero.'
        },
        director: { 
            name:'Ridley Scott',
            bio:'Ridley Scott was born on November 30, 1937 in South Shields, Tyne and Wear. His father was an officer in the Royal Engineers and the family followed him as his career posted him throughout the United Kingdom and Europe before they eventually returned to Teesside. Scott wanted to join the Royal Army (his elder brother Frank had already joined the Merchant Navy) but his father encouraged him to develop his artistic talents instead and so he went to West Hartlepool College of Art and then London\'s Royal College of Art where he helped found the film department.',
            birthyear:'November 30, 1937 in South Shields, County Durham, England, UK',
            deathyear:''
        },
        actors: ['Harrison Ford', 'Rutger Hauer', 'Sean Young'],
        year: 1982,
        score: 8.1,
        rating:'PG-13',
        imageURL:'https://www.imdb.com/title/tt0083658/mediaviewer/rm3676975360/?ref_=tt_ov_i',
        featured:true,
        length: '1h 57m'
    },
    {
        title: 'Mulholland Drive',
        description:'After a car wreck on the winding Mulholland Drive renders a woman amnesiac, she and a perky Hollywood-hopeful search for clues and answers across Los Angeles in a twisting venture beyond dreams and reality.',
        genre: {
            name:'Drama',
            description:'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        director: {
            name:'David Lynch',
            bio:'Born in precisely the kind of small-town American setting so familiar from his films, David Lynch spent his childhood being shunted from one state to another as his research scientist father kept getting relocated. He attended various art schools, married Peggy Lynch and then fathered future director Jennifer Lynch shortly after he turned 21.',
            birthyear:'January 20, 1946 in Missoula, Montana, USA',
            deathyear:''
        },
        actors:['Naomi Watts', 'Laura Harring', 'Justin Theroux'],
        year: 2001,
        score:7.9,
        rating:'PG-13',
        imageURL:'https://www.imdb.com/title/tt0166924/mediaviewer/rm4131972609/?ref_=tt_ov_i',
        featured:true,
        length: '2h 27m'
    },
    {
        title: 'Moon',
        description:'Astronaut Sam Bell has a quintessentially personal encounter toward the end of his three-year stint on the Moon, where he, working alongside his computer, GERTY, sends back to Earth parcels of a resource that has helped diminish our planet\'s power problems.',
        genre:{
            name:'Mystery',
            description:'A mystery film is a genre of film that revolves around the solution of a problem or a crime. It focuses on the efforts of the detective, private investigator or amateur sleuth to solve the mysterious circumstances of an issue by means of clues, investigation, and clever deduction. The plot often centers on the deductive ability, prowess, confidence, or diligence of the detective as he attempts to unravel the crime or situation by piecing together clues and circumstances, seeking evidence, interrogating witnesses, and tracking down a criminal.'
        },
        director: {
            name:'Duncan Jones',
            bio:'Duncan Jones was born on May 30, 1971 in Bromley, Kent, England. He is a director and writer, known for Moon (2009), Source Code (2011) and Mute (2018). He has been married to Rodene Ronquillo since November 6, 2012.',
            birthyear:'May 30, 1971 in Bromley, Kent, England, UK',
            deathyear:''
        },
        actors:['Sam Rockwell', 'Kevin Spacey'],
        year: 2009,
        score: 7.8,
        rating:'R',
        imageURL:'https://www.imdb.com/title/tt1182345/mediaviewer/rm1680837376/?ref_=tt_ov_i',
        featured:true,
        length: '1h 37m'
    },
    {
        title: 'The Piano',
        description:'In the mid-19th century a mute woman is sent to New Zealand along with her young daughter and prized piano for an arranged marriage to a farmer, but is soon lusted after by a farm worker.',
        genre:{
            name:'Drama',
            description:'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        director: {
            name:'Jane Campion',
            bio:'Jane Campion was born in Wellington, New Zealand, and now lives in Sydney, New South Wales, Australia. Having graduated with a BA in Anthropology from Victoria University of Wellington in 1975, and a BA, with a painting major, at Sydney College of the Arts in 1979, she began filmmaking in the early 1980s, attending the Australian Film Television and Radio School (AFTRS). Her first short film, Peel (1982) won the Palme D\'Or at the Cannes Film Festival in 1986.',
            birthyear:' April 30, 1954 in Wellington, New Zealand',
            deathyear:''
        },
        actors:['Holly Hunter', 'Harvey Keitel', 'Sam Neill', 'Anna Paquin'],
        year: 1993,
        score: 7.5,
        rating:'R',
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

//List of Users
app.get('/users', (req, res)=> {
    res.status(200).json(users);
});

//List of Movies
app.get('/movies', (req, res)=> {
    res.status(200).json(movies);
});

//Movie by Title
app.get('/movies/:title', (req, res) => {
    const {title} = req.params;
    const movie = movies.find(movie => movie.title === title);

    if(movie){
        res.status(200).json(movie);
    }else{
        res.status(400).json("No such movie");
    }
});

//Info about Genre
app.get('/movies/genre/:genreName', (req, res) => {
    const {genreName} = req.params;
    const genre = movies.find(movie => movie.genre.name === genreName).genre;

    if(genre){
        res.status(200).json(genre);
    }else{
        res.status(400).json("No such genre");
    }
});

//Finding director information
app.get('/movies/directors/:directorName', (req, res) => {
    const {directorName} = req.params;
    const director = movies.find(movie => movie.director.name === directorName).director;

    if(director){
        res.status(200).json(director);
    }else{
        res.status(400).json("No such diretor");
    }
});

// Create new user

app.post('/users', (req, res) => {
    let newUser = req.body;

    if(!newUser.name){
        const message = "Name is Missing in request body";
        res.status(400).send(message);
    }else{
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    }
});

// Updates username
app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if(!user){
        const message = "There is no user with that id";
        res.status(400).send(message);
    }else{
        user.name = updatedUser.name;
        res.status(201).json(user);
    }
});

// Create new movie to list of favorites
app.post('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;
    
    let user = users.find(user => user.id == id);

    if(!user){
        const message = "There is no user with that id";
        res.status(400).send(message);
    }else{
        user.favoriteMovies.push(movieTitle);
        res.status(201).send(`${movieTitle} has been added to user ${id}'s list`);
    }

});

//Delete a movie fom list of favorites

app.delete('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;
    
    let user = users.find(user => user.id == id);

    if(!user){
        const message = "There is no user with that id";
        res.status(400).send(message);
    }else{
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(201).send(`${movieTitle} has been removed from users ${id}'s list`);
    }

});

//Deregister of a user with id

app.delete('/users/:email', (req, res) => {
    const {email} = req.params;
    
    let user = users.find(user => user.email === email);

    if(!user){
        const message = "There is no user with that email";
        res.status(400).send(message);
    }else{
        users = users.filter( user => user.email !== email );
        res.status(201).send(` User with id: ${email} has been removed`);
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
