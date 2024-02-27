const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
require('dotenv').config();
const db = require('./models');

const app = express();
const PORT = 8000;

const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());

const pageRouter = require('./routes/page');
const { error } = require('console');
app.use('/', pageRouter);

db.sequelize
    .sync({ force: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch((e) => {
        console.log(`DB생성시오류 : `, error);
    });
