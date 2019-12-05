/*eslint-disable no-param-reassign*/
const express = require('express');
const bookController = require('../controllers/bookController');

function routes(Books) {

	const bookRouter = express.Router();
	const controller = bookController(Books);
    //Fetch All Books and filter using genre
	bookRouter.route('/books')
	
		//Fetching books from database
        .get(controller.get)
		
        //Saving data in database 
		.post(controller.post)
		

	//Implementing middle ware to fetch book by ID
	bookRouter.use('/books/:bookId',(req,res,next) => {
		//next is a function used to signal that it has done processing and is ready to pass to next thing
		const bookId = req.params.bookId;
		Books.findById(bookId)
			.then(book => {
				req.book = book;
				return next();
			})
			.catch(error => res.send(error));
	})	
    //Fetch Books Based on ID 
    bookRouter.route('/books/:bookId')
        .get((req, res) => {
			const bookToDisplay = req.book.toJSON();
			bookToDisplay.links = {};
			const genre = req.book.genre.replace(' ' , '%20');
			bookToDisplay.links.filterByThisGenre = `http://${req.headers.host}/api/books/?genre=${genre}`;
            res.json(bookToDisplay);
		})
		//Update the book based on ID
		.put((req,res) => {
           const {book} = req;
				book.title = req.body.title;
				book.author = req.body.author;
				book.genre = req.body.genre;
				book.read = req.body.read;
				book.save()
					.then(book => res.status(201).json(book))
					.catch(error => console.log(error));
		})
		//Update a book field based on ID
		.patch((req,res)=> {
			const {book} = req;
			if(req.body._id){
				delete req.body._id;
			}
			Object.entries(req.body).forEach((item) => {
				const key = item[0];
				const value = item[1];
				book[key] = value;
			});
			req.book.save()
				.then(book => res.status(201).json(book))
				.catch(error => console.log(error));
		})
		.delete((req,res) => {
			req.book.remove()
				.then(() => res.status(204))
				.catch(error => console.log(error));
		})
	
	return bookRouter;
};
module.exports = routes; 