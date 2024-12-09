const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const apiv1Router = require('./routes/apiv1Router');

const app = express();

// Allow all origins for testing
app.set('trust proxy', true);
app.use(
  cors({
    origin: true, // Allows all origins
    methods: 'GET, POST, OPTIONS, DELETE, PATCH',
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', apiv1Router);

module.exports = app;
