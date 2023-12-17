const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Heroku dynamically assigns a port

app.get('/', (req, res) => {
  res.send('Hello from Heroku');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});