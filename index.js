const express = require('express');
const connectToMongo = require('./db');

connectToMongo();

const app = express();
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello Harry!');
});

app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost:${port}`);
});