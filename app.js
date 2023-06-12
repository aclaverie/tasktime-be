const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Task = require('./models/taskModel');

const app = express();
const db = mongoose.connect('mongodb://localhost:27017/tasksdb', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
});
const taskRouter = express.Router();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

//Route for listing all tasks 
taskRouter.route('/tasks')
.get(
  async (req, res) => {
    try{
      //only allow query on parameters that exsit.
      //filters out unwanted queries
      const { query } = req; 
      // console.log(query);
      if((query.task) || (query.who) || (query.dueDate) || (query.done) || ({})){
        //find results based on authorized filter
        let tasks = await Task.find(query).then((err, results)=>{
          if(err) return err;
          return results;
        });
        if(tasks.length === 0){
          res.json({error: "No records found."});
        } else {
          res.json(tasks);
        }        
      } else if(query){
        //return error on unauthorized queries
        res.json({error: "No records found."})
      }
    }catch(err){
        res.json({error: err});
    }
  }
);
//Route for one task based on id
taskRouter.route('/tasks/:taskId')
.get(
  async (req, res) => {
    try{
      let task = await Task.findById(req.params.taskId).then((err, result)=>{          
          if(err) return err;          
          return result;
      });
      res.json(task);
    }catch(err){
        res.json({error: err});
    }
  }
);

app.use('/api', taskRouter);

app.get('/', (req, res) => {
  res.send('TaskTime Back-End API!');
});

app.listen(port, () => {
  console.log(`Running on port: ${port}. `);
});
