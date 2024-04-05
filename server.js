const express = require('express');
const app = express();
const port = 3000;

// Get .env file
// Zie prompt: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#18d1b2e3c8114876b7a658672f80660f
require('dotenv').config();

// set the view engine to ejs
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Get tmdb data
const base_url = "https://api.themoviedb.org/3";
const api_url = base_url + "/person/popular?&page=1&" + process.env.API_Key;

// API fetchen met Promise
async function getData() {
    return fetch(api_url)
    .then((response) => response.json())
    .then((data) => {
        console.log(data.results[0]);
        return data.results;
    });
}

// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#ecf993846c754b9cae95d048caf153b8
app.get('/', async function(req, res) {
    try {
        const data = await getData();

        res.render('pages/index', {
            data
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/single', function(req, res) {
    res.render('pages/single');
  });

// Port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});