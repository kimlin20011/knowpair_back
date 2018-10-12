var express = require('express');
var router = express.Router();

const GetBook = require('../controllers/book/get_book');

getbook = new GetBook();

router.get('/book', getbook.getAllBook);
//router.post('/book', getProduct.getAllProduct);

module.exports = router;