// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require("morgan");

const routes = require('./routes/api/nodes');

const app = express();

const port = process.env.PORT || 5000

// DB Config
const db = require('./config/config').mongoURI;

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

app.listen(port, () => console.log(`Server started on port ${port}`))

// To do: 
// 1) review to add to do items
// 2) add socket.io
// 3) Look up line 18 "...urlencoded({ extended: false }));   //<-----Do I need this?"
// 4) Make sure deployment is set up right
