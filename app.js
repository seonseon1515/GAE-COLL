const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
require('dotenv').config();
const db = require('./models');

const app = express();
const PORT = 8000;

//http서버에 express, socketio연결
const server = http.createServer(app);
const io = socketIo(server);

//미들웨어 설정
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());

//라우터
const pageRouter = require('./routes/page');
app.use('/', pageRouter);
const userRouter = require('./routes/user');
app.use('/api/user', userRouter);

db.sequelize
    .sync({ force: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch((e) => {
        console.log(`DB생성시오류 : `, e);
    });
