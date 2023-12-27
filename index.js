const players = require('./players.js');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const express = require('express');
const { v4: uuid } = require('uuid');

const origin = process.env.NODE_ENV === 'production' ? 'https://dome-concert-controller.vercel.app' : 'http://localhost:3000';

const corsOptions = {
    origin: origin,
    methods: ["GET", "POST"],
    credentials: true,
};

//EXPRESS
const app = express();
const server = http.createServer(app);
app.use(cors(corsOptions));

//SOCKET IO
const io = new Server(server, {cors: corsOptions});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('addPlayer', (data) => {
        const { name, color, id } = data;
        addPlayer(name, color, id);
        console.log('Player added');
    });

    socket.on('removePlayer', (data) => {
        const { id } = data;
        removePlayer(id);
        console.log('Player removed');
    });

    socket.on('getAllRemotePlayers', (data) => {
        io.emit('updateAllRemotePlayers', getAllPlayers());
    });

    socket.on('updateLocalPlayer', (data) => {
        const { id, position } = data;
        updatePlayerPosition(id, position);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.get('/', (req, res) => {
    res.send("Server is running...");
});

const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//TODO: Rewrite so the server hands out an ID to the client
const addPlayer = (name, color, id) => {
    players.push({
        id: id,
        name,
        position: {
            x: 0,
            y: 0
        },
        color,
    });
    // console.log('Player added');
    // console.log('Players: ');
    // players.map(player => console.log(player.name));
}

const removePlayer = (id) => {
    if (players.length > 0) {
        players = players.filter(player => player.id !== id);    
    } else {
        console.log('No players to remove');
    }
}

const getAllPlayers = () => {
    return players;
};

const updatePlayerPosition = (id, position) => {
    if (players.length > 0) {
        const player = players.find(player => player.id === id);
        if (player) {
            player.position = { x: position.x, y: position.y + 40 };    
            // console.log("Updating player with id: " + id);
        } else {
            // console.log('No player found');
        }
    };
}

// const movePlayers = () => {
//     players.forEach(player => {
//         player.position.x += (Math.random() - 0.5) * 10;
//         player.position.y += (Math.random() - 0.5) * 10;
//         if (player.position.x > 400) player.position.x -= 400;
//         if (player.position.y > 400) player.position.y -= 400;
//         if (player.position.x < 0) player.position.x += 400;
//         if (player.position.y < 0) player.position.y += 400;
//     });
// };

// function moveAllPlayers() {
//     setInterval(() => {
//         movePlayers();
//         io.emit('updatePlayerPositions', getAllPlayers());
//     }, 33);
// }

// moveAllPlayers();
