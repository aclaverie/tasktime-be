const express = require('express');

function routes(Task) {
  const taskRouter = express.Router();
  //Route for listing all tasks 
  taskRouter.route('/tasks')
    .post((req, res) => {
      try {

        const task = new Task(req.body);
        task.save();
        // console.log(task);
        return res.status(201).json(task);
      } catch (err) {
        return res.json({ error: err });
      }
    })
    .get(
      async (req, res) => {
        try {
          //only allow query on parameters that exsit.
          //filters out unwanted queries
          const { query } = req;
          // console.log(query);
          if ((query.task) || (query.who) || (query.dueDate) || (query.done) || ({})) {
            //find results based on authorized filter
            let tasks = await Task.find(query).then((err, results) => {
              if (err) return err;
              return results;
            });
            if (tasks.length === 0) {
              return res.json({ error: "No records found." });
            } else {
              return res.json(tasks);
            }
          } else if (query) {
            //return error on unauthorized queries
            return res.json({ error: "No records found." })
          }
        } catch (err) {
          return res.json({ error: err });
        }
      }
    );
  //Route for one task based on id
  taskRouter.route('/tasks/:taskId')
    .get(
      async (req, res) => {
        try {
          let task = await Task.findById(req.params.taskId).then((err, result) => {
            if (err) return err;
            return result;
          });
          res.json(task);
        } catch (err) {
          res.json({ error: err });
        }
      }
    );

    return taskRouter;
}

module.exports = routes;