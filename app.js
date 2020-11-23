
const express = require('express');
const Sequelize = require("sequelize");
const logger = require('morgan');
const bodyParser = require('body-parser')
const router = require('./routes/index');
const cors = require('cors');
const db = require('./models');

const app = express();

//add cross resource sharing support
app.use(cors());

//log requests to console
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));


//api routes 
app.use(router);

// parse application/json
app.use(bodyParser.json());


//DB connection
const sequelize = new Sequelize('degandt', 'degandt', 'allenTD2016#', {
  host: "52.86.154.61",
  dialect: 'mysql'
})

//if connection is good log message to console else log error
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  })

// send 404 if no other route matches
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// setup a global error handler of this app
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);

  db.sequelize.sync();
});

module.exports = app;
