const express = require('express');
const connectToMongo = require('./db');

connectToMongo();

const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello Harry!');
});

app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost:${port}`);
});