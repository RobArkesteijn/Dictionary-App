import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createUser, getUser, addWordsToUser } from '../database';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8080;

app.get('/api/:word', async (req, res) => {
  const word = req.params.word;
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = response.data;
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/api/user/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const user = await getUser(username);
    return res.json(user);
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: 'This user does not exist' })
  }
})

app.post('/api/signup', async (req, res) => {
  const { user, password } = req.body;
  try {
    const newUser = await createUser(user, password);
    return res
        .set('location', `/api/user/${newUser!.user}`)
        .status(201)
        .json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
})

app.post('/api/user/:username/words', async (req, res) => {
  const { username } = req.params;
  const words = req.body;
  const user = await getUser(username);
  try {
    const updatedUser = await addWordsToUser(words, user!);
    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});