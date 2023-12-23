const players = require('./players.js');
const http = require('http');
const cors = require('cors');

const corsOptions = {
    origin: "https://dome-concert-controller.vercel.app",
    methods: ["GET", "POST"],
};

//EXPRESS
const express = require('express');
const app = express();
const port = process.env.PORT || 3010;
app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//SOCKET IO
const { Server } = require('socket.io');
const server = http.createServer(app);

const io = new Server(server, cors(corsOptions));

// const socketPORT = process.env.PORT || 4010;
// server.listen(socketPORT, () => {
//     console.log(`Socket server running on port ${socketPORT}`);
// });

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('updatePlayerPositions', (data) => {
        const { id, position } = data;
        updatePlayerPosition(id, position);
        io.emit('updatePlayerPositions', getAllPlayers());
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.get('/test-cors', function(req, res) {
    res.json({ message: 'CORS-enabled response!' });
});

app.get('/', (req, res) => {
    res.send("Hello from NodeJs!");
});

const addPlayer = (name, color) => {
    players.push({
        id: uuid(),
        name,
        position: {
            x: 0,
            y: 0
        },
        color,
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

const movePlayers = () => {
    players.forEach(player => {
        player.position.x += (Math.random() - 0.5) * 10;
        player.position.y += (Math.random() - 0.5) * 10;
        if (player.position.x > 400) player.position.x -= 400;
        if (player.position.y > 400) player.position.y -= 400;
        if (player.position.x < 0) player.position.x += 400;
        if (player.position.y < 0) player.position.y += 400;
    });
};

function moveAllPlayers() {
    setInterval(() => {
        movePlayers();
        io.emit('updatePlayerPositions', getAllPlayers());
    }, 16.67);
}

moveAllPlayers();
