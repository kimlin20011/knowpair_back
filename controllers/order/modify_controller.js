// var express = require('express');
// var router = express.Router();

// const OrderGetMethod = require('../controllers/order/get_controller');
// const OrderModifyMethod = require('../controllers/order/modify_controller');

const orderBook = require('../../models/order/orderComplete');

module.exports = class ModifyOrder {
    // 訂整筆訂單
    orderBook(req, res, next) {
       
	        const orderList = {
	            owner_ID: req.body.owner_ID,
	            id: req.body.bookID,
	            quantity: req.body.quantity,
	            orderDate: onTime(),
	        }
	        orderBook(orderList).then(result => {
	            res.json({
	                result: result
	            })
	        }, (err) => {
	            res.json({
	                result: err
	            })
	        })
	    }
	}


//取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS
const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}