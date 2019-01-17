// DB Setup
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const https = require('https');

const sequelize = new Sequelize('database', 'username', 'password', {
	dialect: 'sqlite',
	storage: './library.db',
	host: 'localhost',
	port: '3000',
	logging: false,
	define: { timestamps: false },
});

const Book = sequelize.define('Books', {
	title: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	author: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	genre: {
		type: Sequelize.STRING,
	},
	year: {	
		type: Sequelize.INTEGER,
	},
	createdAt: {
		allowNull: true,
		type: Sequelize.DATE,
	},
	updatedAt: {
		allowNull: true,
		type: Sequelize.DATE,
	}
}, {
	timeStamps: false
});

// DB Helpers
// The issue with getting these to run was that the library.db file in the current directory was empty
// so no tables existed in it. I needed to copy the already populated db into this folder and then
// the helpers worked.
const getNextId = () => getAllBooks()
	.then(books => books.length + 1)
	.catch(err => console.log(err));
const getAllBooks = () => Book.findAll()
	.then(data => JSON.parse(JSON.stringify(data)))
	.catch(err => console.log(err));
const getBook = idToGet => Book.findAll({ where: { id: idToGet }})
	.then(book => JSON.parse(JSON.stringify(book)))
	.catch(err => console.log(err));
const createBook = book => getNextId()
	.then(nextId => Book.create({id: nextId, ...book, createdAt: new Date(), updatedAt: new Date()}))
	.catch(err => console.log(err));
const deleteBook = bookId => Book.destroy({ where: { id: bookId }})
	.catch(err => console.log(err));
const updateBook = (bookId, updatedBook) => Book.update({...updatedBook}, { where: { id: bookId }})
	.catch(err => console.log(err));

// Express dependency declarations
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");

// Express setup
	// Routes setup
var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();
var port = 8000;

	// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

	// App setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  if (err.status === 404) {
  	res.render('page-not-found');
  } else {
  	res.render('error');
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database successfully connected on port 3000!');
  })
  .then(() => {
    app.listen(port, () => console.log(`App listening on port ${port}!`))
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports.database = sequelize;
module.exports.dbBooks = Book;
module.exports.getNextId = getNextId;
module.exports.getAllBooks = getAllBooks;
module.exports.getBook = getBook;
module.exports.createBook = createBook;
module.exports.deleteBook = deleteBook;
module.exports.updateBook = updateBook;
module.exports = app;