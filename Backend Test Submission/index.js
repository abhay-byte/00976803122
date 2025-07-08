const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', urlRoutes);

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
