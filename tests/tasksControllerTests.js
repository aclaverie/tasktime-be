//Mocha is our testing framework
//should is for assertion
//sinon is for mocking
//setup in package.json to run test using: "test": "mocha tests/**/*Tests.js"

const should = require('should');
const sinon = require('sinon');
const tasksController = require('../controllers/tasksController');


//Describe Method
describe('Task Controller Tests:', () => {
  //Describe our Post
  /* for a Post we need:
    1. take a Task: mock Task
    2. create a new instance of Task: mock request
    3. action a Save: mock response
    4. send a response status of 201 : check for status
  */
  describe('Post', () => {
    it('should not allow an empty \'task: property\' on post request', () => {
      //Javascript is not a type safe language so we can simply create a Task
      //that is a function that takes an object call Task which calls a save
      //below gives use a mock Task object for testing
      const Task = function (task) { this.save = () => {}};

      //We need a request which in this case does something and must have an object
      //creating a task with no task property should throw an error
      const req= {
        task: {
          task: 'Server Check',
          who: 'Sean',
          dueDate: '22/12/2023',
          done: false
        }
      };

      const spy = sinon.spy();
      //response actually calls functions:
      //want to know status and what is sent on the response
      const res = {
        //Use sinon.spy() to keep tracxk of what is called and what is called with etc.
        status: spy,
        send: spy,
        json: spy
      };

      //Connecting the scaffolding to the actuall tasksController to test it
      const controller = tasksController(Task);
      
      const result = controller.post(req, res);

      
      //Checking with a 400 means bad request and use of should with a message
      res.status.calledWith(400).should.equal(true, `Bad Status ${res}`);
      console.log(res.status);
      res.send.calledWith('Task is required').should.equal(true);

    });
  });
});
