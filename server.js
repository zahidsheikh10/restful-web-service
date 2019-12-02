const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = express();

// mongoDB config
const uri = require('./setup/myurl').mongoURL
console.log(uri);
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

// Connect to Database
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established sucessfully");
})

const Book = require('./models/bookModel');
const bookRouter = express.Router();

bookRouter.route('/books')
  .get((req,res) => {
    Book.find()
      .then(book => {
        res.json(book);
      })
      .catch(error => res.send(error));
  })

app.use('/api',bookRouter);
app.get('/',(req,res) => {
  res.send('Welcome to my Restful Api');
});

app.listen(port,() => console.log(`Server is up and running on port : ${port}`));
