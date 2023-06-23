const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var Message = mongoose.model('Message', { name: String, message: String });

const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.get('/messages', (req, res) => {
  Message.find({})
    .then((messages) => {
      res.send(messages);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message
    .save()
    .then(() => {
      io.emit('message', req.body);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.delete('/messages', (req, res) => {
  Message.deleteMany({})
    .then(() => {
      io.emit('message', {}); // Emit an empty message to clear the chat on the client side
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

var server = http.listen(process.env.PORT || 3000, () => {
  console.log('Server is running at port', server.address().port);

  io.on('connection', (socket) => {
    console.log('A user is connected');

    socket.on('disconnect', () => {
      console.log('A user has disconnected');
    });
  });
});
