const express = require('express');
const router = express.Router();
const https = require('https');
const app = require('../app');
const bookIdRouter = require('./bookId')

router.get('/', function(req, res, next) {
	app.getAllBooks()
		.then(dbBooks => res.render('books', {books: dbBooks}))
		.catch(err => console.log(err));
});

router.get('/new', function(req, res, next) {
	res.render('new-book');
});

router.post('/new', function(req, res, next) {
	app.createBook(req.body)
		.then(result => {
			if (result === undefined) {
				res.render('new-book', { errorMessage: "Title and Author cannot be blank." });
			} else {
				res.render('new-book', { bookAdded: true });
			}
		});

});

router.use('/book_detail', bookIdRouter);

module.exports = router;