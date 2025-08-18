let pokemon1 = document.getElementById('pokemon1');
let pokemon2 = document.getElementById('pokemon2');
let battleArea = document.getElementById('battle-area');
let startBattleButton = document.getElementById('start-battle');
const backgroundMusic = document.getElementById('background-music');

let pokemon1LivesCount = document.getElementById('pokemon1-lives-count');
let pokemon2LivesCount = document.getElementById('pokemon2-lives-count');
let timerCountElement = document.getElementById('timer-count');

let usuario_id = document.getElementById('usuario_id');


let pokemon1Id = '';
let pokemon2Id = '';

let pokemon1Lives = 10;
let pokemon2Lives = 10;
let timerCount = 60;
let timerInterval;

// El valor del input oculto indica el perdedor o si es empate
const hiddenInput = document.getElementById('hidden-input');

// indica si la batalla terminó
const hiddenFinish = document.getElementById('hidden-finish');

const battleAreaBounds = {
    width: battleArea.offsetWidth,
    height: battleArea.offsetHeight
};


const pokemonSize = { width: 100, height: 100 };


function getInitialPositions() {
    const battleAreaWidth = battleArea.offsetWidth;
    const battleAreaHeight = battleArea.offsetHeight;

    return {
        pokemon1Position: { x: 100, y: battleAreaHeight / 2 - 50 },
        pokemon2Position: { x: battleAreaWidth - 200, y: battleAreaHeight / 2 - 50 }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Obtener posiciones iniciales
    ({ pokemon1Position, pokemon2Position } = getInitialPositions());

    // Actualizar las posiciones en el DOM
    pokemon1.style.left = pokemon1Position.x + 'px';
    pokemon1.style.top = pokemon1Position.y + 'px';

    pokemon2.style.left = pokemon2Position.x + 'px';
    pokemon2.style.top = pokemon2Position.y + 'px';

    // Configurar imágenes iniciales
    pokemon1.src = `./pokeball.png`; 
    pokemon2.src = `./pokeball.png`;
});



function asignarPokemon1(id) {
    pokemon1Id = id; 
    pokemon1.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon1Id}.png`;
    pokemon1.classList.add('flipped');
}

function asignarPokemon2(id) {
    pokemon2Id = id;
    pokemon2.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon2Id}.png`;
    pokemon2.classList.remove('flipped');
}

// Función para lanzar un ataque
function launchAttack(attackerPosition, defenderPosition, attackerId) {
    let attack = document.createElement('div');
    attack.style.position = 'absolute';
    attack.style.left = attackerPosition.x + 50 + 'px'; // Inicia desde el centro del Pokémon atacante
    attack.style.top = attackerPosition.y + 50 + 'px';
    attack.style.width = '10px';
    attack.style.height = '10px';
    attack.style.backgroundColor = 'yellow';
    attack.style.borderRadius = '50%';

    document.getElementById('battle-area').appendChild(attack);

    // Calcular la dirección del ataque hacia el oponente
    let deltaX = defenderPosition.x - attackerPosition.x;
    let deltaY = defenderPosition.y - attackerPosition.y;
    let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // Pitagoras mieo
    let velocityX = (deltaX / distance) * 5; // Velocidad del proyectil en X
    let velocityY = (deltaY / distance) * 5; // Velocidad del proyectil en Y

    // Movimiento del ataque hacia el Pokémon defensor
    let attackInterval = setInterval(() => {
        let currentX = parseFloat(attack.style.left);
        let currentY = parseFloat(attack.style.top);

        // Verificar límites del área de batalla
        if (
            currentX < 0 || currentX > battleAreaBounds.width ||
            currentY < 0 || currentY > battleAreaBounds.height
        ) {
            clearInterval(attackInterval); // Detener el ataque
            attack.remove(); // Eliminar el proyectil
            return;
        }

        // Verificar si el ataque ha llegado al objetivo
        if (Math.abs(currentX - defenderPosition.x - 50) < 10 && Math.abs(currentY - defenderPosition.y - 50) < 10) {
            clearInterval(attackInterval); // Detener el ataque cuando llega al objetivo
            launchAttackEffect(defenderPosition, attackerId); // Llamar al efecto de colisión
            attack.remove(); // Eliminar el proyectil
        } else {
            attack.style.left = currentX + velocityX + 'px'; // Mover en X
            attack.style.top = currentY + velocityY + 'px'; // Mover en Y
        }
    }, 20);
}

function checkBattleOutcome() {
    if (pokemon1Lives <= 0 || pokemon2Lives <= 0 || timerCount <= 0) {
        clearInterval(timerInterval);

        startBattleButton.style.backgroundColor = 'green';
        startBattleButton.style.color = 'white';
        startBattleButton.innerText = '¡FIN!';
        startBattleButton.disabled = true;

        const winner = pokemon1Lives > pokemon2Lives ? 'Jugador 1' : 'Jugador 2';
        const loser = pokemon1Lives > pokemon2Lives ? 'Jugador 2' : 'Jugador 1';

        pokemon1.classList.add('hidden');
        pokemon2.classList.add('hidden');
        battleArea.style.backgroundImage = 'none';
        battleArea.style.backgroundColor = '#000';

        // Determinar el resultado
        if (pokemon1Lives > pokemon2Lives) {
            hiddenInput.value = 2; // Jugador 1 gana
        } else if (pokemon2Lives > pokemon1Lives) {
            hiddenInput.value = 1; // Jugador 2 gana
        } else {
            hiddenInput.value = 0; // Empate
        }

        hiddenFinish.value = 1;  // Indica que la batalla terminó

        backgroundMusic.pause();

        // Mostrar mensaje de resultado
        let resultMessage = document.createElement('div');
        resultMessage.style.position = 'absolute';
        resultMessage.style.top = '50%';
        resultMessage.style.left = '50%';
        resultMessage.style.transform = 'translate(-50%, -50%)';
        resultMessage.style.color = 'white';
        resultMessage.style.fontSize = '24px';
        resultMessage.style.textAlign = 'center';
        resultMessage.style.padding = '20px';
        resultMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        resultMessage.style.borderRadius = '10px';

        resultMessage.innerHTML = `
            <h2>${winner} gana!</h2>
            <p>${loser} pierde!</p>
        `;

        let empateMessage = document.createElement('div');
        empateMessage.style.position = 'absolute';
        empateMessage.style.top = '50%';
        empateMessage.style.left = '50%';
        empateMessage.style.transform = 'translate(-50%, -50%)';
        empateMessage.style.color = 'white';
        empateMessage.style.fontSize = '24px';
        empateMessage.style.textAlign = 'center';
        empateMessage.style.padding = '20px';
        empateMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        empateMessage.style.borderRadius = '10px';

        empateMessage.innerHTML = `
            <h2>¡Empate!</h2>
        `;

        if ((pokemon1Lives == pokemon2Lives) && (timerCount <= 0)) {
            battleArea.appendChild(empateMessage);
        } else {
            battleArea.appendChild(resultMessage);
        }

        const idUsuario = usuario_id.value;
        const idPkm = hiddenInput.value;  

        const url = `https://localhost:7068/Api_Pdx_DbV2/UsuarioPkm/AgregarPkm/${idUsuario}/${idPkm}/3`;

        fetch(url, {
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
            });
    }
}



function reduceLife(pokemonId) {

    if (pokemon1Lives > 0 && pokemon2Lives > 0) {

        if (pokemonId === 'pokemon1') {
            pokemon1Lives--;
            pokemon1LivesCount.textContent = pokemon1Lives;
        } else if (pokemonId === 'pokemon2') {
            pokemon2Lives--;
            pokemon2LivesCount.textContent = pokemon2Lives;
        }
        checkBattleOutcome();
    }
    
}


// función de colisión para reducir vidas
function launchAttackEffect(defenderPosition, attackerId) {
    console.log(`${attackerId} ha golpeado a su oponente en (${defenderPosition.x}, ${defenderPosition.y})`);
    if (attackerId === 'pokemon1') {
        reduceLife('pokemon2');
    } else {
        reduceLife('pokemon1');
    }
}



startBattleButton.addEventListener('click', () => {
    pokemon1.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon1Id}.png`;
    pokemon2.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon2Id}.png`;

    startBattleButton.style.backgroundColor = 'red';
    startBattleButton.style.color = 'white';
    startBattleButton.innerText = '¡Batalla Iniciada!';

    backgroundMusic.play();

    // Cronómetro
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


    document.addEventListener('keydown', function (event) {
        const key = event.key;

        // Movimiento de Pokémon 1 (A, D, W, S)
        if (key === 'a') {
            pokemon1Position.x = Math.max(0, pokemon1Position.x - 10); // No salir por la izquierda
            pokemon1.classList.remove('flipped');
        } else if (key === 'd') {
            pokemon1Position.x = Math.min(battleAreaBounds.width - pokemonSize.width, pokemon1Position.x + 10); // No salir por la derecha
            pokemon1.classList.add('flipped');
        } else if (key === 'w') {
            pokemon1Position.y = Math.max(0, pokemon1Position.y - 10); // No salir por arriba
        } else if (key === 's') {
            pokemon1Position.y = Math.min(battleAreaBounds.height - pokemonSize.height, pokemon1Position.y + 10); // No salir por abajo
        }

        // Movimiento de Pokémon 2 (Flechas)
        if (key === 'ArrowLeft') {
            pokemon2Position.x = Math.max(0, pokemon2Position.x - 10);
            pokemon2.classList.remove('flipped');
        } else if (key === 'ArrowRight') {
            pokemon2Position.x = Math.min(battleAreaBounds.width - pokemonSize.width, pokemon2Position.x + 10);
            pokemon2.classList.add('flipped');
        } else if (key === 'ArrowUp') {
            pokemon2Position.y = Math.max(0, pokemon2Position.y - 10);
        } else if (key === 'ArrowDown') {
            pokemon2Position.y = Math.min(battleAreaBounds.height - pokemonSize.height, pokemon2Position.y + 10);
        }

        // Lanzar ataque (tecla Q para Pokémon 1, tecla Enter para Pokémon 2)
        if (key === 'q') {
            launchAttack(pokemon1Position, pokemon2Position, 'pokemon1');
        } else if (key === 'Enter') {
            launchAttack(pokemon2Position, pokemon1Position, 'pokemon2');
        }

        // Actualizar posiciones de los Pokémon
        pokemon1.style.left = pokemon1Position.x + 'px';
        pokemon1.style.top = pokemon1Position.y + 'px';
        pokemon2.style.left = pokemon2Position.x + 'px';
        pokemon2.style.top = pokemon2Position.y + 'px';
    });
});



document.addEventListener('DOMContentLoaded', () => {
    cargarPokemon('pokemon-list-1', asignarPokemon1);
    cargarPokemon('pokemon-list-2', asignarPokemon2);
});

function cargarPokemon(tableId, callback) {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')  // Cargar 10 Pokémon
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById(tableId);
            tableBody.innerHTML = ''; // Limpiar la tabla
            data.results.forEach((pokemon, index) => {
                let id = index + 1; // ID de Pokémon
                let row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="${pokemon.name}"></td>
                    <td>${pokemon.name}</td>
                    <td><button onclick="${callback.name}(${id})">Seleccionar</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error cargando Pokémon:', error));
}
