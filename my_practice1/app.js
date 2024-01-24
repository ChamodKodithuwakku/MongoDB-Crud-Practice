//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//configuring the mongoDB
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/registerDetailsDB')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

//end of configuring the mongoDB
//creating the schema
const regDetails = new mongoose.Schema({
  name: {
    type: String,
    required : true,
    minlength: 2,
    maxlength: 50
  },
  age:{
    type : String,
    required : true
  },
  phoneNo:{
    type : String,
    required:true,
    minlength:10,
    maxlength:10
  }
})
//end of creating the schema

//creating the model
const User = mongoose.model('User', regDetails);
//end of creating the model


//creating the directries to the pages
app.get("/", function(req, res){
  let f = false; // Default value
  res.render("home", { flag: f });
})

app.get("/home",function(req,res){

  let f = false; // Define flag and set it to false by default
    if (req.query.status === 'success') {
        f = true; // Set flag to true if the condition is met
        console.log(f +"kodi");
    }
  res.render("home" ,{flag : f});
})

app.get("/about", function(req,res){

  res.render("about");
})

app.get("/contact", function(req,res){

  res.render("contact");
})

app.get("/details", async (req, res) => {
  try {
    // Wait for the User.find() operation to complete and store the result in userDetails
    const userDetails = await User.find();
    // Now render the details page and pass the retrieved userDetails to the template
    res.render("details", { uDetails: userDetails });
  } catch (error) {
    // If an error occurs, send the error message
    res.status(500).send("Error retrieving user details: " + error.message);
  }
});
//................end of creating the directries to the pages

//creating the get request to user update page
app.get("/update_user_details/:id", async function(req, res) {
  const userId = req.params.id;
  console.log(userId);
  try {
    const userDetails = await User.findById(userId);
    
    res.render("update", { u_Details: userDetails , uid : userId });
  } catch (err) {
    console.log(err);
    // res.status(500).send("An error occurred while fetching the user details.");
  }
});

//................end of the user update get request

//............post methods..............

//registering form post method
app.post("/register_form", async function(req, res) {
  const { name_field, age_field, phoneNo_field } = req.body;

  const user = new User({
    name: name_field,
    age: age_field,
    phoneNo: phoneNo_field
  });

  try {
    const savedUser = await user.save();
    // send back a response, e.g., the saved user, a success message, or a redirect
    console.log("user saved succesfully");
    // Example usage:

    res.redirect("/home?status=success");
   
  } catch (error) {
    // handle errors that occur during save
    res.status(500).send(error.message);
  }
});
//end of registering form post method

//creating post method to delete user from user detalis

app.post("/delete_user_details",async function(req,res){

  const id = req.body.userID;
  console.log(id);

  try{
    const result = await User.findByIdAndDelete(id);
    console.log("Deleted successfully");
    res.redirect("/details")

  }catch(err){
    console.log(err);
  }

})

//end of user delete post

//creating user updating post request
app.post("/update_user_details", async function(req,res){

  const id = req.body.userID;
  try{
     await res.redirect(`/update_user_details/${id}`)
  }catch(err){
    console.log(err);
  }
})

//......end of user updating post request

//updating form


app.post("/update_register_form", async function(req,res){

  const { name_field, age_field, phoneNo_field } = req.body;
 

  const user = {
    name: name_field,
    age: age_field,
    phoneNo: phoneNo_field
  };
  const id = req.body.userId;
  console.log(id);
  
try {
  const updatedUser = await User.findByIdAndUpdate(id, user, {
    new: true, // Return the modified document rather than the original. defaults to false
    runValidators: true // Ensures the update obeys the schema
  });

  if (!id) {
    res.status(404).send("User not found.");
    console.log(id)
  } else {
    console.log("Updated User: ", updatedUser);
    res.redirect("/details");
  }
} catch (error) {
  console.error(error);
 
}


})
//........end of updating form


//..............end of post methods............



//creating the function to show toast





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
