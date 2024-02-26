const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const PORT = 8000;

const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));

const pageRouter = require('./routes/page');
app.use('/', pageRouter);

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
