// CRUD API Endpoints Backend
// Developed By: Mayank Jain
// Submitted To: GDSC ADGITM

// OPERATIONS PERFORMED:

// 1. Create new ToDo Item
// 2. List all items
// 3. List all pending items
// 4. Update any item
// 5. Delete any item
// 6. Mark any item as DONE
// 7. Find any item

require("dotenv").config();                  // For Storing secrets like connection password
const express = require("express");          // working to handle this backend
const bodyParser = require("body-parser");   // package for parsing user input
const mongoose = require("mongoose");        // package to do operations with our cloud database
const _ = require("lodash");                 // for converting user data to lowercase

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
mongoose                                                    //Database Connection
  .connect(process.env.DATABASE_CONNECTION), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error(err));

const todoListSchema = new mongoose.Schema({                //Schema is defined
  itemName: String,
  status: { type: String, enum: ["pending", "done"] }
});

const List = mongoose.model("List", todoListSchema);

app.get("/items", function (req, res) {                     //List all items
  List.find({})
    .then((data) => {
      res.send(JSON.stringify(data));
    })
    .catch((err) => {
      res.send(err);
    });
});
app.get("/items/pending", function (req, res) {          //List all pending items
  List.find({ status: "pending" })
    .then((data) => {
      res.send(JSON.stringify(data));
    })
    .catch((err) => {
      res.send(err);
    });
});
app
  .route("/todolist/:todoItem")
  .get(function (req, res) {                                //Find item
    List.find({ itemName: _.lowerCase(req.params.todoItem) })
      .then((foundItems) => {
        res.send(JSON.stringify(foundItems));
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post(function (req, res) {                               //Create new ToDo Item
    const newItem = new List({
      itemName: _.lowerCase(req.params.todoItem),
      status: "pending",
    });
    newItem
      .save()
      .then((savedItem) => {
        res.write("status: 200, successfully created \n");
        res.write(savedItem);
        res.send();
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete(function (req, res) {                                //Delete any item
    List.findOneAndDelete({ itemName: _.lowerCase(req.params.todoItem) })
      .then((deletedItem) => {
        res.write('Code: 200, succesfully deleted \n');
        res.write(JSON.stringify(deletedItem));
        res.send();
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .put(function (req, res) {                                   //Update any item
    List.updateOne(
      { itemName: _.lowerCase(req.params.todoItem) },
      {
        itemName: _.lowerCase(req.body.itemName),
        status: _.lowerCase(req.body.status)
      },
      { overwrite: true }
    )
      .then((Response) => {
        res.write('Code: 200, succesfully updated \n');
        res.write(Response);
        res.send();
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .patch(function (req, res) {                                //Mark any item as DONE
    List.findOneAndUpdate(
      { itemName: _.lowerCase(req.params.todoItem) },
      { $set: { status: _.lowerCase(req.body.status) } },
      { new: true }
    )
      .then((Response) => {
        res.send(Response);
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.listen(3000 || process.env.PORT, function () {
  console.log("Server started on port 3000");                  //Server starting
});
