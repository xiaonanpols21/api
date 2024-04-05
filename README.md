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
