const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// setup express

const app = express();
app.use(express.json()); // read json objects from requests
app.use(cors());

const PORT = process.env.PORT || 5000;

/*
    Start with `nodemon index.js` 
*/

app.listen(PORT, () => console.log(`The server has started on port ${PORT}`));

// setup mongoose --> we go to MongoDB Atlas to create project and cluster
// Go to Database access
// Also need to white list our IP Address
// Go back to cluster and "connect" to get connection string

mongoose.connect(
	process.env.MONGODB_CONNECTION_STRING,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	(err) => {
		if (err) throw err;
		console.log('MongoDB connection established.');
	}
);

// create modals --> how our collections will look like
// create routes --> how we interact with Database

// setup routes
app.use('/users', require('./routes/userRouter'));
