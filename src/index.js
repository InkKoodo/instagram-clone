import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const dbURI = process.env.DB_URI;
const app = express();
const port = 3000;

mongoose.connect(dbURI)
  .then(() => {
    app.listen(port, () => {
      console.log(`listen at port: http://localhost:${port}`);
    });
  })
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Home');
});

app.get('/:username', (req, res) => {
  res.send('User page');
});
