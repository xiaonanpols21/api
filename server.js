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
    const likedPeople = Object.keys(req.cookies)
        .filter(cookie => cookie.startsWith('liked_'))
        .map(cookie => cookie.replace('liked_', ''))
        .map(cookie => JSON.parse(cookie));

    console.log({likedPeople});
    
    return likedPeople;
}

function filterLikedItems(data, likedPeople) {
    const dataID = data[0].id;
    if (likedPeople.some(item => item.id === dataID)) {
        console.log("You liked this one already");
    }
    
    return data;
}

// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#ecf993846c754b9cae95d048caf153b8
app.get('/', async function(req, res) {
    try {
        const likedPeople = getLikedPeopleFromCookies(req);

        let data = await getPeople(1);
        data = filterLikedItems(data, likedPeople);

    
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

// Get page after button clicked
app.post('/choice', async function(req, res) {
    const { like, page } = req.body;

    if (like) {
        res.cookie(`liked_${like}`, true);
    }
    res.redirect(`/${parseInt(page) + 1}`);
});

// Get the page 
app.get('/:page', async function(req, res) {
    try {
        const likedPeople = getLikedPeopleFromCookies(req);

        let data = await getPeople(req.params.page);
        data = filterLikedItems(data, likedPeople);
        
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

// Port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});