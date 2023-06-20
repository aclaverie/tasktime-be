function tasksController(Task) {
  //Using the revealing module pattern
  function post(req, res) {
    (async () => {
      try {
        const task = await new Task(req.body);
        if (req.body.task === "") {
          return res.json({ error: "All fields required" });
        } else if (req.body.desc === "") {
          return res.json({ error: "All fields required" });
        } else if (req.body.who === "") {
          return res.json({ error: "All fields required" });
        } else if (req.body.dueDate === "") {
          return res.json({ error: "All fields required" });
        } else if (req.body.done === "") {
          return res.json({ error: "All fields required" });
        }
        task.save();
        //ideal for production not good for test have to seperate
        //Test ENV
        res.status(201);
        return res.json(task);
        //Production
        //return res.status(201).json(task);        
      } catch (err) {
        return res.json({ error: err });
      }
    })()
  };

  function get(req, res) {
    (async () => {
      try {
        //only allow query on parameters that exsit.
        //filters out unwanted queries
        const { query } = req;
        // console.log(query);
        if ((query.task) || (query.desc) || (query.who) || (query.dueDate) || (query.done) || ({})) {
          //find results based on authorized filter
          let tasks = await Task.find(query).then((err, results) => {
            if (err) return err;
            return results;
          });

          if (tasks.length === 0) {
            return res.json({ error: "No records found." });
          } else {

            const returnedTasks = tasks.map((task) => {
              const newTask = task.toJSON();
              newTask.links = {};
              newTask.links.self = `https://${req.headers.host}/api/tasks/${task._id}`;
              return newTask;
            })
            return res.json(returnedTasks);
          }
        } else if (query) {
          //return error on unauthorized queries
          return res.json({ error: "No records found." })
        }
      } catch (err) {
        return res.json({ error: err });
      }
    })();
  }
  return { post, get };
}

module.exports = tasksController;