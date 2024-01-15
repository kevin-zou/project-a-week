import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

const usernames = new Map();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.join(socket.id); // For sending messages to this user only

  socket.on('chat message', (msg) => {
    const username = usernames.get(socket.id);
    io.emit('chat message', { msg, username });
  });

  socket.on('new username', (username) => {
    const takenUsernames = Array.from(usernames.values());
    if (takenUsernames.includes(username)) {
      io.to(socket.id).emit('username taken');
    } else {
      usernames.set(socket.id, username);
      io.to(socket.id).emit('username ok');
      io.emit('updated users', Array.from(usernames.values()));
    }
  });

  socket.on('disconnect', () => {
    usernames.delete(socket.id);
    io.emit('updated users', Array.from(usernames.values()));
  })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
