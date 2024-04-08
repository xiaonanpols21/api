const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true })); // support form-


// Get .env file
// Zie prompt: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#18d1b2e3c8114876b7a658672f80660f
require('dotenv').config();

// set the view engine to ejs
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Get tmdb data
const base_url = "https://api.themoviedb.org/3";

// API fetchen met Promise
async function getData(page) {
    const api_url = base_url + "/person/popular?&page=" + page + "&" + process.env.API_Key;

    return fetch(api_url)
    .then((response) => response.json())
    .then((data) => {
        console.log( data.results.slice(0, 1));
        return data.results.slice(0, 1);
    });
}

// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#ecf993846c754b9cae95d048caf153b8
app.get('/', async function(req, res) {
    try {
        const data = await getData(1);

        res.render('pages/index', {
            page: 1,
            data
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/:page', async function(req, res) {
    try {
        const data = await getData(req.params.page);

        res.render('pages/index', {
            page: req.params.page,
            data
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

app.post('/choice', async function(req, res) {
    console.log(parseInt(req.body.page) + 1)

    res.redirect(`/${parseInt(req.body.page) + 1}`)
});

app.get('/single', function(req, res) {
    res.render('pages/single');
  });

// Port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});