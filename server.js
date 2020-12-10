const express = require('express');
const path = require('path');

const basePath = '/sosialhjelp/mock-alt';

const app = express(); // create express app

//app.use(basePath, express.static('public'));
app.use(express.static(path.join(__dirname, './', 'build')));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, './', 'build', 'index.html'));
});

// Nais functions
app.get(`${basePath}/internal/isAlive|isReady`, (req, res) => res.sendStatus(200));

// start express server on port 5000
app.listen(5000, () => {
    console.log('server started on port 5000');
});
