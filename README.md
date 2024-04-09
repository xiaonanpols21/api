# API
## Concept
Voor mijn project maak ik gebruik van de TMDB API. Ik ga een app maken waarbij je de acteurs en actrices kan liken en disliken. Dus het is een Tinder variant met acteurs en actrices. 

### Design
Hier is design gemaakt waar er is gekeken naar de TMDB Huisstijl en de Tinder Huisstijl. Idee extra: Filter op geslacht en laat de gelikte mensen zien in een aparte sectie. 

![Design](https://github.com/xiaonanpols21/api/blob/main/public/img/readme/design.png)

## Technisch
Voor mijn project gebruik ik Express in de server.js en EJS als template engine. 

## Versies
### Versie 1
Ik begon met het fetchen van de TMDB data. 
```js
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
```

In de browser die je het volgende. De volgende stap is om te kijken om de data op te slaan in een nieuwe array als de user een persoon heeft geliket. 

![v1](https://github.com/xiaonanpols21/api/blob/main/public/img/readme/v-1.png)

### Versie 2
Om de data met buttons te manipuleren moet dat via de client side gebeurt worden. Ik pak de data die via de server wordt getoond. Dan pakt hij de data en stopt hij dat in een array op de client en op die manier kan ik dan liken en disliken. Uitleg van die code volgt. 
```js
// Get data on client
// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#b648ab4676944b0ea43517825fc9845b
const data = [];

main.querySelectorAll('article').forEach(article => {
    const name = article.querySelector('h2').textContent.trim();
    const imageUrl = article.querySelector('img').getAttribute('src');

    data.push({
        name: name,
        img: imageUrl,
    });
});
```

### Versie 3
Ik ging vragen aan Cyd wat een goede manier is om meerdere cards te laten zien als je bij de laatste bent. Zij verwees mij door naar Declan. Hij hielp mij om de buttons werkend te krijgen van client side naar server side. Van de buttons maak je een form. Als je op like of dislike klikt dan ga je naar een nieuwe pagina. 
```html
 <form method="POST" action="/choice">
    <input type="hidden" name="page" value="<%= page %>" />
    <button name="dislike" value="<%= item.id %>" type="submit" aria-label="Dislike button">
        <img src="img/icons/cross.svg" alt="Cross icon">
    </button>
    <button name="like" value="<%= item.id %>" type="submit" aria-label="Like button">
        <img src="img/icons/heart.svg" alt="Heart icon">
    </button>
</form>
```

Wanneer je bij die nieuwe pagina bent redirect je naar een andere pagina met de page number achter de url. 
```js
app.post('/choice', async function(req, res) {
    console.log(parseInt(req.body.page) + 1)

    res.redirect(`/${parseInt(req.body.page) + 1}`)
});
```

Je refresht de pagina eigenlijk elke keer wanneer je gaat liken en disliken naar de volgende pagina. 
```js
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
```

### Versie 4
Ik heb er nu voor gezorgd dat de data wordt gefilterd op asians. Uitleg van deze code wordt gevolgd.
```js
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
```

### Versie 5
Hier worden de gelikete items opgeslagen met cookies. Uitleg van deze code wordt gevolgd.
![v5](https://github.com/xiaonanpols21/api/blob/main/public/img/readme/v-5.png)
```js
// Cookies
// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17?pvs=25#dea859d311134652bf95b0ea47e4018e
const likedPeople = Object.keys(req.cookies).filter(cookie => cookie.startsWith('liked_')).map(cookie => cookie.replace('liked_', ''));
console.log(likedPeople)
```

Ook heb ik er voor gezorgd dat de items die already geliket zijn verwijdert worden
```js
 // Delete already liked
// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#63df3380b3f94a61a5e14d367d914019
const filteredItems = newItem.filter(item => {
    const itemID = item.id.toString();
    return !likedArray.includes(itemID);
});
```

## Gesprekken
### Gesprek 1
Ik had gesproken met Cyd. Ik liet mijn werk zien van idee tot in de code. Ze gaf me tips voor het liken en het swipen voor een Tinder effect.

#### Liken
- Local storage
- Paar in laden, daarna next

#### Swipe effect
Add eventlistener voor zelfde functie:

- Touch start
- Mouse down

- Mouse move

Stop

- Mouse up
- Touch end
- Touch up
