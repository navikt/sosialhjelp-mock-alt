const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const basePath = '/sosialhjelp/mock-alt';

const app = express(); // create express app
app.disable('x-powered-by');
//app.use(basePath, express.static('public'));

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 100, // Limit each IP to 100 requests per minute
    message: 'You have exceeded the 100 requests in 1 minute limit!',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

app.use(limiter);
app.set('trust proxy', 1); // 1 reverse proxy

app.use(basePath, express.static(path.join(__dirname, './', 'build'), { index: false }));

app.use(/^(?!.*\/(internal|static)\/).*$/, (req, res, next) => {
    res.sendFile(path.join(__dirname, './', 'build', 'index.html'));
});

// Nais functions
app.get(`${basePath}/internal/isAlive|isReady`, (req, res) => res.sendStatus(200));

// start express server on port 5000
app.listen(5000, () => {
    console.log('server started on port 5000');
});
