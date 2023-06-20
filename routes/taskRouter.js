const express = require('express');
const tasksController = require('../controllers/tasksController');

function routes(Task) {
  const taskRouter = express.Router();
  const controller = tasksController(Task);
  taskRouter.route('/tasks')
    //Creating a New Task
    .post(controller.post)
    //Route for listing all tasks 
    .get(controller.get);

  //Use of middleware to inject the repeated task of find Task by Id
  //Only being used in '/tasks/:taskId'
  taskRouter.use('/tasks/:taskId', async (req, res, next) => {
    try {
      let task = await Task.findById(req.params.taskId)
        .then((err, result) => {
          if (err) return err;
          return result;
        });
      if (task) {
        //we create a property in the req object to store the task
        //this makes it available downstream to get, put etc.
        req.task = task;
        return next();
      }
      return res.sendStatus(404);
    } catch (err) {
      return res.json({ error: err });
    }
  });
  //Route actions for one task based on id
  taskRouter.route('/tasks/:taskId')
    //returns a task by id
    .get(async (req, res) => {
      const returnedTasks = await req.task.toJSON();
      returnedTasks.links = {};
      const assignee = req.task.who.replace(' ', '%20');
      returnedTasks.links.FilterByWho = `https://${req.headers.host}/api/tasks?who=${assignee}`;
      return res.json(returnedTasks);
    })
    //Full update/replacement of a task by id
    .put(async (req, res) => {
      //destructure and pull out task
      const { task } = req;
      //change properties based on edited task
      task.task = req.body.task;
      task.desc = req.body.desc;
      task.who = req.body.who;
      task.dueDate = req.body.dueDate;
      task.done = req.body.done;
      //saves to database with mongoose library
      //using proper asynchronous technique to save
      //noting mongoose returns a promise
      req.task.save()
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.json({ error: err });
        });
    })
    //Updates only the portions requiring update
    .patch(async (req, res) => {
      //destructure and pull out task
      const { task } = req;
      //check if user sent id field which is not to be updated
      if (req.body._id) {
        delete req.body._id
      }
      //Use Object.entries to pull out key-value pairs array
      //this usage will allow for ForEach use and objects with many properties
      //and avoid the tideious task of writing if else statements
      //to check if they are there and update... arrggghhhh
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        task[key] = value;
      });
      //using proper asynchronous technique to save
      req.task.save()
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.json({ error: err });
        });
    })
    //Deletes the task
    .delete(async (req, res) => {
      req.task.deleteOne()
        .then(() => {
          return res.sendStatus(204);
        })
        .catch((err) => {
          return res.send(err);
        });
    });

  return taskRouter;
}

module.exports = routes;