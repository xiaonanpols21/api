const express = require('express');
const app = express();
const port = 3000;

// set the view engine to ejs
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Data aanvragen
const api_key = "api_key=c9c582007e770d9564a6499f6e364a2a";
const base_url = "https://api.themoviedb.org/3";
const api_url = base_url + "/person/popular?language=hi-KO&page=3&" + api_key;
//const api_url = base_url + "/person/changes" + api_key + "&language=en-US&sort_by=popularity.desc&page=1&primary_release_year=2020&with_original_language=hi|ko|";

//https://api.themoviedb.org/3/person/popular?language=hi-KO&page=1&api_key=c9c582007e770d9564a6499f6e364a2a

// API fetchen met Promise
async function getKdrama() {
    return fetch(api_url)
    .then((response) => response.json())
    .then((data) => {
        console.log(data.results);
        return data.results;
    });
}

// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#ecf993846c754b9cae95d048caf153b8
app.get('/', async function(req, res) {
    try {
        const data = await getKdrama();

        res.render('pages/index', {
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