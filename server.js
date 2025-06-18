const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('../public'));

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        if (room && room.size === 1) {
            socket.join(roomID);
            io.to(roomID).emit('startGame');
        } else {
            socket.join(roomID);
        }
    });

    socket.on('movePlayed', (data) => {
        socket.to(data.room).emit('opponentMove', data);
    });

    socket.on('rematch', (roomID) => {
        io.to(roomID).emit('resetGame');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});