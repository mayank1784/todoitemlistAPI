// CRUD API Endpoints Backend
// Developed By: Mayank Jain 
// Submitted To: GDSC ADGITM

// OPERATIONS PERFORMED:

// 1. Create new ToDo Item
// 2. List all items    get all
// 3. List all pending items    get specific
// 4. Update any item   put
// 5. Delete any item   delete
// 6. Mark any item as DONE patch

require('dotenv').config() // For Storing secrets like connection password
const express = require('express'); // working to handle this backend
const bodyParser = require('body-parser'); 
const mongoose = require("mongoose"); //package to do operations with our cloud database
const _ = require("lodash");//for converting user data to 

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
mongoose //Database Connection
  .connect(process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error(err));
  
  const todoListSchema = new mongoose.Schema({
    itemName: String,
    status: { type: String, enum: ['pending', 'done'] }
  });
  
  const List = mongoose.model("List", todoListSchema);

  app.route("/todolist/:todoItem").get().post(function(req,res){
    const newItem = new List({
        itemName: _.lowerCase(req.params.todoItem),
        status: 'pending'
    });
    newItem.save().then((savedItem) => {
        res.send(JSON.stringify({item_id:savedItem.id,item:savedItem.itemName,status:savedItem.status}));
    }).catch((err) =>{
        res.send(err);
    });
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  app.listen(3000 || process.env.PORT, function () {
    console.log("Server started on port 3000"); //Server starting
  });