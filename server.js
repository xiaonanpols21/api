const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Get .env file
// Zie prompt: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#18d1b2e3c8114876b7a658672f80660f
require('dotenv').config();

// set the view engine to ejs
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//  Filter asians
// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#8cc9fb73efee48869c62dc09215b47c1
async function getPeople(page) {
    const api_url = "https://api.themoviedb.org/3/person/popular?&page=" + page + "&" + process.env.API_Key;
    
    return fetch(api_url)
    .then((response) => response.json())
    .then((data) => {

        const asianActors = data.results.filter(person => {
            return person.known_for
                .some(item => ["ko", "th", "jp", "ja", "zh"]
                .includes(item.original_language.toLowerCase()))
        });

        let randomItem;

        if (asianActors.length > 0) {
            const randomIndex = Math.floor(Math.random() * asianActors.length);
            randomItem = asianActors[randomIndex];
        } else if (data.results.length > 0) {
            // If no desired language items found, select a random item from data.results
            const randomIndex = Math.floor(Math.random() * data.results.length);
            randomItem = data.results[randomIndex];
        }

        return [randomItem];
    });
}

// Fetch single page people
async function getSinglePerson(id, page) {
    const api_url = `https://api.themoviedb.org/3/person/${id}?${process.env.API_Key}`;

    return fetch(api_url)
        .then((response) => response.json())
        .then((data) => {
            return data;
        });
}

function getLikedPeopleFromCookies(req) {
    const likedPeopleCookie = req.cookies.likedPeople;

    // If the likedPeople cookie exists and is not empty, parse its value
    if (likedPeopleCookie) {
        const likedPeople = JSON.parse(likedPeopleCookie);
        console.log("Liked People from Cookie:", likedPeople);
        return likedPeople;
    } else {
        return [];
    }
}

function getDislikedPeopleFromCookies(req) {
    const dislikedPeopleCookie = req.cookies.dislikedPeople;

    // If the dislikedPeople cookie exists and is not empty, parse its value
    if (dislikedPeopleCookie) {
        const dislikedPeople = JSON.parse(dislikedPeopleCookie);
        console.log("Disliked People from Cookie:", dislikedPeople);
        return dislikedPeople;
    } else {
        return [];
    }
}


// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#ecf993846c754b9cae95d048caf153b8
app.get('/', async function(req, res) {
    try {
        const likedPeople = getLikedPeopleFromCookies(req);
        let data = await getPeople(1);
    
        res.render('pages/index', {
            page: 1,
            data,
            likedPeople,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

// All likes in 1 cookie
// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#148468b0774f4ebe8b9199720e56b3eb
// Get page after button clicked
app.post('/choice', async function(req, res) {
    const { like, dislike, page } = req.body;

    if (like) {
        // If like button is clicked, add the liked person to the likedPeople cookie
        res.cookie(`likedPeople`, JSON.stringify([...getLikedPeopleFromCookies(req), JSON.parse(like)]));
    } else if (dislike) {
        // If dislike button is clicked, add the disliked person's ID to the dislikedPeople cookie
        res.cookie(`dislikedPeople`, JSON.stringify([...getDislikedPeopleFromCookies(req), dislike]));
    }
    
    res.redirect(`/${parseInt(page) + 1}`);
});

// Get the page 
app.get('/:page', async function(req, res) {
    try {
        const likedPeople = getLikedPeopleFromCookies(req);
        let data = await getPeople(req.params.page);
        
        res.render('pages/index', {
            page: req.params.page,
            data,
            likedPeople
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});


// Single page
app.get('/person/:id', async function(req, res) {
    try {
        const data = await getSinglePerson(req.params.id);

        res.render('pages/single', {
            data
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

//404


// Port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});