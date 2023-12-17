const { v4: uuidv4 } = require('uuid');

const cors = require('cors');

const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // Heroku dynamically assigns a port

if (process.env.NODE_ENV === 'development') {
    app.use(cors());
} else if(process.env.NODE_ENV === 'production') {
    app.use(cors({
        origin: 'https://dome-concert-controller-nziz4kqok-antonklocks-projects.vercel.app/'
    }));
}

let players = [
    {
        id: uuidv4(),
        name: "Anton",
        position: {
            x: 0,
            y: 0
        },
        color: "red"
    }
];

const getPosition = (id) => {
    return players.find(player => player.id === id).position;
};

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

app.get('/', (req, res) => {
    const response = {
        message: "Hello from Heroku!"
    }
    res.json(response);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});