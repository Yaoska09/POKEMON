let pokemon1 = document.getElementById('pokemon1');
let pokemon2 = document.getElementById('pokemon2');
let pokemon1Lives = 20;
let pokemon2Lives = 20;
let pokemon1Position;
let pokemon2Position;

let battleArea = document.getElementById('battle-area');
let startBattleButton = document.getElementById('start-battle');
const backgroundMusic = document.getElementById('background-music');

let pokemon1LivesCount = document.getElementById('pokemon1-lives-count');
let pokemon2LivesCount = document.getElementById('pokemon2-lives-count');
let timerCountElement = document.getElementById('timer-count');
let pokemon1LifeBar = document.getElementById('pokemon1-life-bar');
let pokemon2LifeBar = document.getElementById('pokemon2-life-bar');

let usuario_id = document.getElementById('usuario_id');

let pokemon1Id = '';
let pokemon2Id = '';
let selectedPokemon1Card = null;
let selectedPokemon2Card = null;


let timerCount = 60;
let timerInterval;

const hiddenInput = document.getElementById('hidden-input');
const hiddenFinish = document.getElementById('hidden-finish');

const battleAreaBounds = {
    width: battleArea.offsetWidth,
    height: battleArea.offsetHeight
};

const pokemonSize = { width: 120, height: 120 };
let battleStarted = false;


function getInitialPositions() {
    const battleAreaWidth = battleArea.offsetWidth;
    const battleAreaHeight = battleArea.offsetHeight;

    return {
        pokemon1Position: { x: 100, y: battleAreaHeight / 2 - 60 },
        pokemon2Position: { x: battleAreaWidth - 220, y: battleAreaHeight / 2 - 60 }
    };
}
function updateLifeBar(pokemonNumber, lives) {
    const percentage = (lives / 20) * 100;
    if (pokemonNumber === 1) {
        pokemon1LifeBar.style.width = percentage + '%';
    } else {
        pokemon2LifeBar.style.width = percentage + '%';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    ({ pokemon1Position, pokemon2Position } = getInitialPositions());

    pokemon1.style.left = pokemon1Position.x + 'px';
    pokemon1.style.top = pokemon1Position.y + 'px';

    pokemon2.style.left = pokemon2Position.x + 'px';
    pokemon2.style.top = pokemon2Position.y + 'px';

    pokemon1.src = `./pokeball.png`;
    pokemon2.src = `./pokeball.png`;

    cargarPokemon('pokemon-grid-1', asignarPokemon1);
    cargarPokemon('pokemon-grid-2', asignarPokemon2);
});

function asignarPokemon1(id, card) {
    pokemon1Id = id;
    pokemon1.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon1Id}.png`;
    pokemon1.classList.add('flipped');

    if (selectedPokemon1Card) {
        selectedPokemon1Card.classList.remove('selected-pokemon');
    }
    selectedPokemon1Card = card;
    card.classList.add('selected-pokemon');
}

function asignarPokemon2(id, card) {
    pokemon2Id = id;
    pokemon2.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon2Id}.png`;
    pokemon2.classList.remove('flipped');

    if (selectedPokemon2Card) {
        selectedPokemon2Card.classList.remove('selected-pokemon');
    }
    selectedPokemon2Card = card;
    card.classList.add('selected-pokemon');
}

function updateLifeBar(pokemonNumber, lives) {
    const percentage = (lives / 20) * 100;
    if (pokemonNumber === 1) {
        pokemon1LifeBar.style.width = percentage + '%';
    } else {
        pokemon2LifeBar.style.width = percentage + '%';
    }
}

function launchAttack(attackerPosition, defenderPosition, attackerId) {
    let attack = document.createElement('div');
    attack.style.position = 'absolute';
    attack.style.left = attackerPosition.x + 60 + 'px';
    attack.style.top = attackerPosition.y + 60 + 'px';
    attack.style.width = '12px';
    attack.style.height = '12px';
    attack.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
    attack.style.borderRadius = '50%';
    attack.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.8)';
    attack.style.zIndex = '10';

    document.getElementById('battle-area').appendChild(attack);

    let deltaX = defenderPosition.x - attackerPosition.x;
    let deltaY = defenderPosition.y - attackerPosition.y;
    let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    let velocityX = (deltaX / distance) * 6;
    let velocityY = (deltaY / distance) * 6;

    let attackInterval = setInterval(() => {
        let currentX = parseFloat(attack.style.left);
        let currentY = parseFloat(attack.style.top);

        if (
            currentX < 0 || currentX > battleAreaBounds.width ||
            currentY < 0 || currentY > battleAreaBounds.height
        ) {
            clearInterval(attackInterval);
            attack.remove();
            return;
        }

        if (Math.abs(currentX - defenderPosition.x - 60) < 15 && Math.abs(currentY - defenderPosition.y - 60) < 15) {
            clearInterval(attackInterval);
            launchAttackEffect(defenderPosition, attackerId);
            attack.remove();
        } else {
            attack.style.left = currentX + velocityX + 'px';
            attack.style.top = currentY + velocityY + 'px';
        }
    }, 20);
}

function checkBattleOutcome() {
    if (pokemon1Lives <= 0 || pokemon2Lives <= 0 || timerCount <= 0) {
        clearInterval(timerInterval);

        startBattleButton.style.background = 'linear-gradient(45deg, #2ed573, #26de81)';
        startBattleButton.innerHTML = '✅ ¡BATALLA TERMINADA!';
        startBattleButton.disabled = true;

        const winner = pokemon1Lives > pokemon2Lives ? 'Jugador 1' : 'Jugador 2';
        const loser = pokemon1Lives > pokemon2Lives ? 'Jugador 2' : 'Jugador 1';

        pokemon1.classList.add('hidden');
        pokemon2.classList.add('hidden');
        battleArea.style.backgroundImage = 'none';
        battleArea.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

        if (pokemon1Lives > pokemon2Lives) {
            hiddenInput.value = 2;
        } else if (pokemon2Lives > pokemon1Lives) {
            hiddenInput.value = 1;
        } else {
            hiddenInput.value = 0;
        }

        hiddenFinish.value = 1;
        backgroundMusic.pause();

        let resultMessage = document.createElement('div');
        resultMessage.style.position = 'absolute';
        resultMessage.style.top = '50%';
        resultMessage.style.left = '50%';
        resultMessage.style.transform = 'translate(-50%, -50%)';
        resultMessage.style.color = 'white';
        resultMessage.style.fontSize = '28px';
        resultMessage.style.textAlign = 'center';
        resultMessage.style.padding = '30px';
        resultMessage.style.background = 'linear-gradient(145deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))';
        resultMessage.style.backdropFilter = 'blur(20px)';
        resultMessage.style.borderRadius = '20px';
        resultMessage.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        resultMessage.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
        resultMessage.style.zIndex = '100';

        if ((pokemon1Lives == pokemon2Lives) && (timerCount <= 0)) {
            resultMessage.innerHTML = `
                <h2 style="font-family: 'Orbitron', monospace; margin-bottom: 15px; color: #ffeaa7;">🤝 ¡EMPATE!</h2>
                <p style="color: #ddd;">¡Ambos luchadores dieron todo!</p>
            `;
        } else {
            resultMessage.innerHTML = `
                <h2 style="font-family: 'Orbitron', monospace; margin-bottom: 15px; color: #2ed573;">🏆 ¡${winner} GANA!</h2>
                <p style="color: #ddd;">¡Increíble batalla!</p>
            `;
        }

        battleArea.appendChild(resultMessage);

        const idUsuario = usuario_id.value;
        const idPkm = hiddenInput.value;  

        const url = `https://localhost:7068/Api_Pdx_DbV2/UsuarioPkm/AgregarPkm/${idUsuario}/${idPkm}/3`;

        /*fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 0,
                idUsuario: idUsuario,
                pkm_id: idPkm,
                nombre: `${loser} perdió contra ${winner}`,
                estado: 3,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Resultado guardado:', data);
        })
        .catch(error => {
            console.error('Error al guardar el resultado:', error);
        });*/
        document.getElementById("resetGameButton").classList.remove("hidden");

    }
}

function reduceLife(pokemonId) {
    if (pokemon1Lives > 0 && pokemon2Lives > 0) {
        if (pokemonId === 'pokemon1') {
            pokemon1Lives--;
            pokemon1LivesCount.textContent = pokemon1Lives;
            updateLifeBar(1, pokemon1Lives);
        } else if (pokemonId === 'pokemon2') {
            pokemon2Lives--;
            pokemon2LivesCount.textContent = pokemon2Lives;
            updateLifeBar(2, pokemon2Lives);
        }
        checkBattleOutcome();
    }
}

function launchAttackEffect(defenderPosition, attackerId) {
    console.log(`${attackerId} ha golpeado a su oponente en (${defenderPosition.x}, ${defenderPosition.y})`);
    if (attackerId === 'pokemon1') {
        reduceLife('pokemon2');
    } else {
        reduceLife('pokemon1');
    }
}

startBattleButton.addEventListener('click', () => {
    if (!pokemon1Id || !pokemon2Id) {
        alert('¡Ambos jugadores deben seleccionar un Pokémon!');
        return;
    }
    battleStarted = true;

    pokemon1.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon1Id}.png`;
    pokemon2.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon2Id}.png`;

    startBattleButton.style.background = 'linear-gradient(45deg, #ff4757, #ff6348)';
    startBattleButton.innerHTML = '⚔️ ¡BATALLA EN CURSO!';

    backgroundMusic.play();

    timerInterval = setInterval(() => {
        timerCount--;
        timerCountElement.textContent = timerCount;

        if (timerCount <= 0) {
            clearInterval(timerInterval);
            timerCount = 0;
            timerCountElement.textContent = timerCount;
            checkBattleOutcome();
        }
    }, 1000);
    });

   document.addEventListener('keydown',  function (event) {
    if (!battleStarted) return;  // Aquí evitamos movimientos si no empezó la batalla

    const key = event.key;

    if (key === 'a') {
        pokemon1Position.x = Math.max(0, pokemon1Position.x - 12);
        pokemon1.classList.remove('flipped');
    } else if (key === 'd') {
        pokemon1Position.x = Math.min(battleAreaBounds.width - pokemonSize.width, pokemon1Position.x + 12);
        pokemon1.classList.add('flipped');
    } else if (key === 'w') {
        pokemon1Position.y = Math.max(0, pokemon1Position.y - 12);
    } else if (key === 's') {
        pokemon1Position.y = Math.min(battleAreaBounds.height - pokemonSize.height, pokemon1Position.y + 12);
    }

    if (key === 'ArrowLeft') {
        pokemon2Position.x = Math.max(0, pokemon2Position.x - 12);
        pokemon2.classList.remove('flipped');
    } else if (key === 'ArrowRight') {
        pokemon2Position.x = Math.min(battleAreaBounds.width - pokemonSize.width, pokemon2Position.x + 12);
        pokemon2.classList.add('flipped');
    } else if (key === 'ArrowUp') {
        pokemon2Position.y = Math.max(0, pokemon2Position.y - 12);
    } else if (key === 'ArrowDown') {
        pokemon2Position.y = Math.min(battleAreaBounds.height - pokemonSize.height, pokemon2Position.y + 12);
    }

    if (key === 'q') {
        launchAttack(pokemon1Position, pokemon2Position, 'pokemon1');
    } else if (key === 'Enter') {
        launchAttack(pokemon2Position, pokemon1Position, 'pokemon2');
    }

    pokemon1.style.left = pokemon1Position.x + 'px';
    pokemon1.style.top = pokemon1Position.y + 'px';
    pokemon2.style.left = pokemon2Position.x + 'px';
    pokemon2.style.top = pokemon2Position.y + 'px';
     });
     
     ////////



function cargarPokemon(gridId, callback) {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=12')
        .then(response => response.json())
        .then(data => {
            let grid = document.getElementById(gridId);
            grid.innerHTML = '';
            data.results.forEach((pokemon, index) => {
                // Extraer el ID real del URL de la API
                const urlParts = pokemon.url.split('/');
                const id = urlParts[urlParts.length - 2];
                let card = document.createElement('div');
                card.className = 'pokemon-card rounded-xl p-4 cursor-pointer';
                card.innerHTML = `
                    <div class="text-center">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" 
                             alt="${pokemon.name}" 
                             class="pokemon-image w-16 h-16 mx-auto mb-3">
                        <h3 class="text-lg font-bold text-white capitalize mb-3">${pokemon.name}</h3>
                        <button class="select-btn w-full py-2 px-4 rounded-lg text-white font-semibold">
                            ✨ Seleccionar
                        </button>
                    </div>
                `;

                card.addEventListener('click', () => {
                    callback(id, card);
                });

                grid.appendChild(card);
            });
        })
        .catch(error => console.error('Error cargando Pokémon:', error));
}
document.getElementById('resetGameButton').addEventListener('click', () => {
    // Reiniciar vidas
    pokemon1Lives = 10;
    pokemon2Lives = 10;
    pokemon1LivesCount.textContent = pokemon1Lives;
    pokemon2LivesCount.textContent = pokemon2Lives;
    updateLifeBar(1, pokemon1Lives);
    updateLifeBar(2, pokemon2Lives);

    // Reiniciar timer
    timerCount = 60;
    timerCountElement.textContent = timerCount;

    // Quitar mensaje de resultado
    const resultMessage = document.querySelector('#battle-area > div');
    if(resultMessage) {
        resultMessage.remove();
    }

    // Mostrar pokemones
    pokemon1.classList.remove('hidden');
    pokemon2.classList.remove('hidden');

    // Restaurar fondo
    battleArea.style.backgroundImage = "url('./fondo_estadio.jpg')";
    battleArea.style.background = 'none';

    // Habilitar y resetear botón iniciar
    startBattleButton.disabled = false;
    startBattleButton.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    startBattleButton.innerHTML = '🚀 INICIAR BATALLA';

    // Esconder botón reiniciar
    document.getElementById('resetGameButton').classList.add('hidden');

    // Parar música si sigue sonando
    backgroundMusic.pause();

    // Resetear posiciones iniciales de pokemones
    const positions = getInitialPositions();
    pokemon1Position = positions.pokemon1Position;
    pokemon2Position = positions.pokemon2Position;
    pokemon1.style.left = pokemon1Position.x + 'px';
    pokemon1.style.top = pokemon1Position.y + 'px';
    pokemon2.style.left = pokemon2Position.x + 'px';
    pokemon2.style.top = pokemon2Position.y + 'px';

    // Resetear valores ocultos
    hiddenFinish.value = 0;
    hiddenInput.value = 0;
});