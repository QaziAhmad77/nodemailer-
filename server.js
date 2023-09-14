const express = require('express');
const app = express();
const port = 4000;
const router = require('./routes');
const { connectDB } = require('./models');
app.use(express.json());
connectDB();

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
