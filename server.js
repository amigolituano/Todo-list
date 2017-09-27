var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

var dbUri="mongodb://test:test123@ds133004.mlab.com:33004/nodejs-uzduotis"
mongoose.connect(dbUri, { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose connection successful')
});

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var todoSchema = new Schema({
    note: String,
    date: { type: Date, default: Date.now},
    isDone: {type: Boolean, default: false}
});

var Todo = mongoose.model('todo', todoSchema);

// =====================================

app.get("*", function(req, res) {
  Todo.find(function(err, todos) {
    if(err) {
      console.log(err);
    } else {
      res.render("main",  {todos: todos.reverse()});
    }
  });
});

app.post("/", function(req, res) {
	var newTodo = new Todo({
  		note: req.body.note,
  	});

	newTodo.save(function(err) {
		if (err) throw err;
		console.log("User saved successfully");
	});

	res.redirect("/")

});

app.delete("/:todo_id", function(req, res) {
  Todo.findById(req.params.todo_id, function(err, todo) {  
    if(err) {
      console.log(err);
    } else {

      todo.remove(function(err) {
        if (err) throw err;
        console.log("User removed successfully");

        res.redirect("/");
        });
    }
  });
});

app.put("/:todo_id", function(req, res) {
  Todo.findById(req.params.todo_id, function(err, oldTodo) {  
    if(err) {
      console.log(err);
    } else {
      oldTodo.note =req.body.newNote;

      oldTodo.save(function(err) {
        if (err) throw err;
        console.log("Note updated successfully");

        res.redirect("/");
        });
    }
  });
});

app.put("/done/:todo_id", function(req, res) {
  Todo.findById(req.params.todo_id, function(err, oldTodo) {  
    if(err) {
      console.log(err);
    } else {
      oldTodo.isDone = !oldTodo.isDone;

      oldTodo.save(function(err) {
        if (err) throw err;
        console.log("Note updated successfully");

        res.redirect("/");
        });
    }
  });
});

// =====================================

app.listen(process.env.PORT || 5000, function(){
console.log("Server is running");

});