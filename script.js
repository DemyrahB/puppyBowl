const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");
const newPlayerForm = document.getElementById("addNewPlayer")
const players = JSON.parse(localStorage.getItem("players")) || [];

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2308-ACC-ET-WEB-PT-B";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/2308-ACC-ET-WEB-PT-B/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
//const players = []

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL);
    const result = await response.json();
    return result.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
    return [];
  }
};

fetchAllPlayers();

const displayPlayers = (players) => {
  playerContainer.innerHTML=""
  const playersDivs = players.map((player) => {
    const div = document.createElement("div")
    div.setAttribute('id', 'player-card');
    const image = document.createElement("img");
    image.setAttribute("src", player.imageUrl);
    const nameHolder = document.createElement("p");
    nameHolder.innerHTML = player.name;
    const breed = document.createElement("p");
    breed.innerHTML = player.breed;
    const status = document.createElement("p");
    status.innerHTML = player.status;
    const button = document.createElement('button')
    button.textContent = "Remove Player"
    button.setAttribute('id', 'delete-btn')
    button.addEventListener('click', async ()=> {
       removePlayer(player.id)
       const response = await fetchAllPlayers()
      renderAllPlayers(response)
    })
    const button2 = document.createElement('button')
    button2.textContent = "See More Details"
    button2.addEventListener('click', function(){
        alert(`Player ${player.id}: ${player.name} is a ${player.breed}. ${player.name}'s player status is ${player.status}`)
    }); 
    div.append(nameHolder, image, breed, status, button, button2);
    return div;
  });
  playerContainer.append(...playersDivs);
};

const fetchSinglePlayer = async (id) => {
  try {
    const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/2308-ACC-ET-WEB-PT-B/players/${id}`);
        const result = await response.json();
        console.log(result.data.player);
        return result
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${id}!`, err);
  }
};

const addNewPlayer = async (players) => {
  try {
    const response = await fetch(APIURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(players),
    });
    const result = await response.json();
    return result
    ;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  fetch(APIURL, {
    method: "DELETE",
  });
  try {
    const response = await fetch(`${APIURL}/${playerId}`, {
      method: "DELETE",
    });
    const result = await response.json();
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};


/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
  try {
    displayPlayers(playerList);
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
 try { 
  const addPuppy = document.getElementById('addNewPlayer');
  addPuppy.addEventListener('submit', async function(e){
  e.preventDefault()
  const newPuppy = {
    name: newPlayerForm.name.value,
    breed: newPlayerForm.breed.value,
    status: newPlayerForm.status.value,
    imageUrl: newPlayerForm.imageUrl.value,
  }
    console.log(newPuppy)
    const addedPuppy = await addNewPlayer(newPuppy)
    const response = await fetchAllPlayers()
    renderAllPlayers(response)
    //newPlayerFormContainer.prepend(addedPuppy)
}) 
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};
 

const init = async () => {
  const players = await fetchAllPlayers();
  console.log(players);
  renderAllPlayers(players);

  renderNewPlayerForm();
};

init();
