const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;
const db = mongoose.connect('mongodb+srv://aclaverie:9nuWubu4@cluster0.sdlwvxz.mongodb.net/tasksdb?retryWrites=true&w=majority', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
});

const Task = require('./models/taskModel');
const taskRouter = require('./routes/taskRouter')(Task);

//required to pull Json out of the Post Body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//cross-origin
app.use(cors());

app.use('/api', taskRouter);

app.get('/', (req, res) => {
  res.send('TaskTime Back-End API!');
});

app.listen(port, () => {
  console.log(`Running on port: ${port}. `);
});
