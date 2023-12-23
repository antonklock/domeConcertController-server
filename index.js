const players = require('./players.js');
const http = require('http');
const cors = require('cors');

//EXPRESS
const express = require('express');
const app = express();
const port = process.env.PORT || 3010;

//SOCKET IO
const { Server } = require('socket.io');
const server = http.createServer(app);

const corsOptions = {
    origin: "https://dome-concert-controller.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
};

app.use(cors(corsOptions));

const io = new Server({
  cors: corsOptions,
});


const PORT = process.env.PORT || 4010;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
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

// app.get('/', (req, res) => {
//     const response = {
//         message: "Hello from NodeJs!"
//     }
//     res.json(response);
// });

app.get('/players', (req, res) => {
    res.json(players);
});

function moveAllPlayers() {
    setInterval(() => {
        movePlayers();
        io.emit('updatePlayerPositions', getAllPlayers());
    }, 16.67);
}

moveAllPlayers();
