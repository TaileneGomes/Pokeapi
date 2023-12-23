const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

let limit = 12;
let offset = 1;

previous.addEventListener("click", () => {
  if (offset > limit) {
    offset -= limit;
    removePokemonNodes(pokemonContainer);
    fetchAndDisplayPokemons(offset, limit);
  }
});

next.addEventListener("click", () => {
  offset += limit;
  removePokemonNodes(pokemonContainer);
  fetchAndDisplayPokemons(offset, limit);
});

function searchFormSubmitted(event) {
  event.preventDefault();
  const searchInput = document.getElementById('searchInput').value;
  searchPokemon(searchInput);
}

function fetchPokemon(identifier) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}/`)
    .then((res) => res.json());
}

function fetchAndDisplayPokemons(offset, limit) {
  spinner.style.display = "block";

  const promises = [];
  for (let i = offset; i < offset + limit; i++) {
    promises.push(fetchPokemon(i));
  }

  Promise.all(promises)
    .then((pokemonDataArray) => {
      spinner.style.display = "none";
      pokemonDataArray.forEach((pokemonData) => {
        createPokemon(pokemonData);
      });
    })
    .catch((error) => {
      console.error("Error fetching Pokémon:", error);
      spinner.style.display = "none";
    });
}

function searchPokemon(identifier) {
  spinner.style.display = "block";
  fetchPokemon(identifier)
    .then((pokemonData) => {
      removePokemonNodes(pokemonContainer);
      createPokemon(pokemonData);
      spinner.style.display = "none";
    })
    .catch((error) => {
      console.error(`Error searching for Pokémon: ${error.message}`);
      spinner.style.display = "none";
    });
}

function createPokemon(pokemon) {
  const flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  flipCard.appendChild(cardContainer);

  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");

  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default;

  spriteContainer.appendChild(sprite);

  const number = document.createElement("p");
  number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = pokemon.name;

  card.appendChild(spriteContainer);
  card.appendChild(number);
  card.appendChild(name);

  const cardBack = document.createElement("div");
  cardBack.classList.add("pokemon-block-back");

  cardBack.appendChild(progressBars(pokemon.stats));

  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);
  pokemonContainer.appendChild(flipCard);

  const screenWidth = window.innerWidth;
  const cardWidth = screenWidth / 4;
  flipCard.style.width = cardWidth + "px";
  cardContainer.style.width = "100%";
}

function progressBars(stats) {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  for (let i = 0; i < 3; i++) {
    const stat = stats[i];

    const statPercent = stat.base_stat / 2 + "%";
    const statContainer = document.createElement("div");
    statContainer.classList.add("stat-container");

    const statName = document.createElement("p");
    statName.textContent = stat.stat.name;

    const progress = document.createElement("div");
    progress.classList.add("progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.setAttribute("aria-valuenow", stat.base_stat);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 200);
    progressBar.style.width = statPercent;

    progressBar.textContent = stat.base_stat;

    progress.appendChild(progressBar);
    statContainer.appendChild(statName);
    statContainer.appendChild(progress);

    statsContainer.appendChild(statContainer);
  }

  return statsContainer;
}

function removePokemonNodes(parent) {
  const pokemonNodes = parent.querySelectorAll('.flip-card');
  pokemonNodes.forEach((node) => {
    parent.removeChild(node);
  });
}
