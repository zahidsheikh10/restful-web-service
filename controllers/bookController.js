function bookController(Books){
    function post(req, res) {
        const newBook = new Books(req.body);
        if(!req.body.title){
            res.status(400);
            return res.send('Title is required');
        }
        newBook.save()
            .then(book => res.status(201).json(book))
            .catch(error => console.log(error));

    }
    function get(req, res) {
        const query = {};
        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        Books.find(query)
            .then(books => {
                const bookToDisplay = books.map(books => {
                    const newBook = books.toJSON();
                    newBook.links = {};
                    newBook.links.self = `http://${req.headers.host}/api/books/${books._id}`;
                    return newBook;
                })
                // res.json(books);
                res.json(bookToDisplay);
            })
            .catch(error => res.send(error));
    }
    return {
        post,
        get
    }
}
module.exports = bookController;