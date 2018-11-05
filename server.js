const 
  express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  path = require('path'),
  logger = require("morgan"),
  routes = require('./routes/api/nodes'),
  port = process.env.PORT || 5000,
  db = require('./config/config').mongoURI,
  FactoryNode = require('./models/FactoryNodeSchema');

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(logger("dev"));

// Connect to Mongo DB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Use Routes
app.use('/api', routes);

// Serve static assest if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
};

// Socket.io for socket set ups to update data in realtime across sessions/browers opened
io.on('connection', client => {  
  console.log('Client connected...');

  client.on('update-server', data => {
    FactoryNode.find({})
      .sort({ date: -1 })
      .then(data => client.broadcast.emit('update-client', data ))
      .catch(err => res.status(404).json({ success: false, error: err }));
  });
});


server.listen(port, () => console.log(`Server started on port ${port}`));


// To do: 
// 1) 