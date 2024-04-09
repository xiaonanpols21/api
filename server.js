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

//  Filter asians
// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#8cc9fb73efee48869c62dc09215b47c1
async function getPeople(page) {
    const api_url = "https://api.themoviedb.org/3/person/popular?&page=" + page + "&" + process.env.API_Key;
    
    return fetch(api_url)
    .then((response) => response.json())
    .then((data) => {
        const newItem = [];
        let foundDesiredLanguage = false;
        
        data.results.forEach(person => {
            const hasDesiredLanguage = person.known_for.some(item => {
                return ["ko", "th", "JP", "ja", "zh"].includes(item.original_language.toLowerCase());
            });

            if (hasDesiredLanguage) {
                newItem.push(person);
                foundDesiredLanguage = true; 
            }
        });

        let randomItem;

        if (newItem.length > 0) {
            const randomIndex = Math.floor(Math.random() * newItem.length);
            randomItem = newItem[randomIndex];
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