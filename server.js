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
        const asianActors = data.results.filter(actor => {
            return actor.known_for.some(movie => ["ko", "th", "jp", "ja", "zh"].includes(movie.original_language.toLowerCase()))
        })

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

// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#ecf993846c754b9cae95d048caf153b8
app.get('/', async function(req, res) {
    try {
        const data = await getPeople(1);
        // console.log("data:", data)

        // Cookies
        // Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17?pvs=25#dea859d311134652bf95b0ea47e4018e
        const likedPeople = Object.keys(req.cookies).filter(cookie => cookie.startsWith('liked_')).map(cookie => cookie.replace('liked_', '')).map(cookie => JSON.parse(cookie));

        // Console already liked
        // Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#7e2ea1e3dac041229aeecc73c760c859
        const dataID = data[0].id; // Accessing the first item in data array
        if (likedPeople.some(item => item.id === dataID)) {
            console.log("You liked this one already");
            // Filter out the item from data array
            //data = await getPeople(1); // Fetch a new random item
        }
    
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

    // const likedItem = JSON.parse(req.body.like);
    // const id = likedItem.id;
    // const name = likedItem.name;
    // const profile_path = likedItem.profile_path;

    if (like) {
        res.cookie(`liked_${like}`, true);
    }
    res.redirect(`/${parseInt(page) + 1}`);
});

// Get the page 
app.get('/:page', async function(req, res) {
    try {
        const data = await getPeople(req.params.page);

        const likedPeople = Object.keys(req.cookies).filter(cookie => cookie.startsWith('liked_')).map(cookie => cookie.replace('liked_', ''));
        // console.log(likedPeople);

        const likedArray = likedPeople.map(item => {
            try {
                return JSON.parse(item);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return null;
            }
        }).filter(item => item !== null); // Remove any items that couldn't be parsed

        // console.log(likedArray);
        
        res.render('pages/index', {
            page: req.params.page,
            data,
            likedPeople,
            likedArray
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