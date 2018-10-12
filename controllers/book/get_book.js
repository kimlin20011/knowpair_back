const bookData = require('../../models/book/all_book_model');

module.exports = class GetBook {
    // 取得全部產品資料
    getAllBook(req, res, next) {
      bookData().then(result => {
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