
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
  db = require('./config/config').mongoURI;
  FactoryNodeSchema = require('../TH/models/FactoryNodeSchema')

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));   //<-----Do I need this?
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
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

io.on('connection', client => {  
  console.log('Client connected...');

  client.on('update-server', data => {
    console.log(data);
    console.log("update-server action hit")
    FactoryNode.find({})
      .sort({ date: -1 })
      .then(data => client.broadcast.emit('update-client', data ))
      .catch(err => res.status(404).json({ success: false, error: err }));
  });
});




server.listen(port, () => console.log(`Server started on port ${port}`))

// To do: 
// 1) review to add to do items
// 2) add socket.io
// 3) Look up line 18 "...urlencoded({ extended: false }));   //<-----Do I need this?"
// 4) Make sure deployment is set up right
