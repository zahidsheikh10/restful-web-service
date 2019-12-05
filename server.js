const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// mongoDB config
if(process.env.ENV === "Test"){
  const uri = require('./setup/myurlTest').mongoURL
  console.log(uri);
  console.log("This is for Test");
  mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

}else{
  const uri = require('./setup/myurl').mongoURL
  console.log(uri);
  console.log("This is for Real");
  mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

}

// Connect to Database
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established sucessfully");
})

const Books = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(Books);
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// using the book router
app.use('/api',bookRouter);

// Router for root 
app.get('/',(req,res) => {
  res.send('Welcome to my Restful Api');
});

app.listen(port,() => console.log(`Server is up and running on port : ${port}`));

module.exports = app;
