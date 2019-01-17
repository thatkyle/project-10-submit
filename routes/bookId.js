const express = require('express');
const router = express.Router();
const https = require('https');
const app = require('../app');

router.get('/:id', function(req, res, next) {
	app.getBook(req.params.id)
		.then(book => res.render('update-book', { bookDetails: book[0] }))
		.catch(err => {
			console.log(err)
			res.render('error');
	});
});

router.post('/:id', function(req, res, next) {
	app.updateBook(req.params.id, req.body)
		.then(app.getBook(req.params.id)
			.then(book => res.render('update-book', { bookDetails: book[0], bookUpdated: true })));
});

router.post('/:id/delete', function(req, res, next) {
	app.deleteBook(req.params.id)
		.then(res.render('update-book', { bookDeleted: true }));
});

module.exports = router;