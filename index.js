const express = require('express');
const app = express();
const path = require('path');

// Database connection
const db = require('./models/index');
db.connect(process.env.DB_URL);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

app.listen(process.env.PORT, () => {
   console.log('The server is running at http://localhost:' + process.env.PORT);
});