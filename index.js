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
        const playerExists = players.some(player => player.id === id);
        console.log('Player exists: ' + playerExists);
        console.log('Name: ' + name);
        console.log('Id: ' + id);

        if (playerExists) updateLocalPlayerInfo(id, color, name);
        else {
            //TODO: MAKE FUNCTIONS PURE
            const newId = addPlayer(name, color);
            socket.emit('setNewId', newId);
        }
    });

    socket.on('updateLocalPlayerInfo', (data) => {
        const { name, color } = data;

        console.log('Updating local player info');
        console.log('Name: ' + name);

        updateLocalPlayerInfo(id, color, name);
    });

    socket.on('checkIfPlayerExists', (data) => {
        const { id } = data;
        const player = players.find(player => player.id === id);
        if (player) {
            console.log("Player exists");
            socket.emit('playerExists', true);
        } else {
            console.log("Player doesn't exists");
            socket.emit('playerExists', false);
        }
    });

    socket.on('removePlayer', (data) => {
        const { id } = data;
        removePlayer(id);
        console.log('Player removed');
    });

    socket.on('getAllRemotePlayers', (data) => {
        io.emit('updateAllRemotePlayers', getAllPlayers());
    });

    socket.on('updateLocalPlayerPosition', (data) => {
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
const addPlayer = (name, color) => {
    const id = uuid();
    console.log('Adding player: ' + name + ' with color: ' + color + ' and id: ' + id);

    players.push({
        id,
        name,
        position: {
            x: 0,
            y: 0
        },
        color,
    });

    return id;
}

const removePlayer = (id) => {
    if (players.length > 0) {
        players = [...players.filter(player => player.id !== id)];
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
            player.position = { x: position.x, y: position.y };    
        } 
    };
}

const updateLocalPlayerInfo = (id, color, playerName) => {
    if (players.length <= 0) {
        console.log('No players to update');
        return;
    };
    const player = players.find(player => player.id === id);
    if (player) {
        console.log("Updating player with id: " + id);
        console.log('From: ' + player.name + " to --> " + playerName);

        player.color = color;
        player.name = playerName;
    } else {
        console.log('No player found');
    }
}
