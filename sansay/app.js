const fs = require('fs');
const express = require('express');
const https = require('https');
const app = express();

const PORT = 4000;
const MAIN_SSL_KEY = "/home/james/server.key";
const MAIN_SSL_CERT = "/home/james/server.crt";

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.send('!');
});

//app.listen(3000, () => console.log('App listening on port 3000!'));
https.createServer({
        key: fs.readFileSync(MAIN_SSL_KEY),
        cert: fs.readFileSync(MAIN_SSL_CERT)
}, app).listen((PORT), () => {
        console.log('Server listening on port ' + PORT);
});
