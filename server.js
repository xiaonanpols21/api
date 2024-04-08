const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Get .env file
// Zie prompt: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#18d1b2e3c8114876b7a658672f80660f
require('dotenv').config();

// set the view engine to ejs
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

async function getPeople(page) {
    const api_url = "https://api.themoviedb.org/3/person/popular?&page=" + page + "&" + process.env.API_Key;

    return fetch(api_url)
    .then((response) => response.json())
    .then((data) => {
        return data.results.slice(0, 1);
    });
}

// API fetchen met Promise
async function getSinglePerson(id) {
    const api_url = `https://api.themoviedb.org/3/person/${id}?${process.env.API_Key}`

    return fetch(api_url)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            return data;
        });
}


// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#ecf993846c754b9cae95d048caf153b8
app.get('/', async function(req, res) {
    try {
        const data = await getPeople(1);

        res.render('pages/index', {
            page: 1,
            data
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

// Get page after button clicked
app.post('/choice', async function(req, res) {
    res.redirect(`/${parseInt(req.body.page) + 1}`)
});

// Get the page 
app.get('/:page', async function(req, res) {
    try {
        const data = await getPeople(req.params.page);

        res.render('pages/index', {
            page: req.params.page,
            data
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

        console.log(data)
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