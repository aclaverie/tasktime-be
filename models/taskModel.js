const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskModel = new Schema(
  {
    task: { type: String, required: true },
    desc: { type: String, required: true },
    who: { type: String, required: true },
    dueDate: { type: String, required: true,  },
    done: { type: Boolean, default: false },
  }
);

const model = mongoose.model('TaskModel', taskModel);

module.exports = model;