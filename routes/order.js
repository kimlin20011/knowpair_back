var express = require('express');
var router = express.Router();

const OrderBook = require('../controllers/order/modify_controller');

orderbook = new OrderBook();
/* GET home page. */
router.post('/order', orderbook.orderBook);

module.exports = router;
