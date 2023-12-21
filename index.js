const players = require('./players.js');

const cors = require('cors');

const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // Heroku dynamically assigns a port

// if (process.env.NODE_ENV === 'development') {
//     app.use(cors());
// } else if(process.env.NODE_ENV === 'production') {
//     app.use(cors({
//         origin: 'https://dome-concert-controller-nziz4kqok-antonklocks-projects.vercel.app/'
//     }));
// }

    app.use(cors());

const addPlayer = (name, color) => {
    players.push({
        id: uuid(),
        name,
        position: {
            x: 0,
            y: 0
        },
        color
    });
}

const removePlayer = (id) => {
    players = players.filter(player => player.id !== id);
}

const getPlayerPosition = (id) => {
    return players.find(player => player.id === id).position;
};

const getAllPlayers = () => {
    return players;
};

const updatePlayerPosition = (id, position) => {
    const player = players.find(player => player.id === id);
    player.position = position;
}

//A function that moves all players on the X axis over time
const movePlayers = () => {
    players.forEach(player => {
        player.position.x += 1;
        if (player.position.x > 400) player.position.x -= 400;
    });
};

app.get('/', (req, res) => {
    const response = {
        message: "Hello from Heroku!"
    }
    res.json(response);
});

app.get('/players', (req, res) => {
    res.json(players);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// function moveAllPlayers() {
//     setInterval(() => {
//         movePlayers();
//     }, 10);
// }

// moveAllPlayers();