const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
   res.render('index');
});

app.listen(process.env.PORT, () => {
   console.log('The server is running at http://localhost:' + process.env.PORT);
});