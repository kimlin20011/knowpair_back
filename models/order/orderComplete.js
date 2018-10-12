const db = require('../connection_db');


module.exports = function orderComplelte(orderList){
	let result= {};
	return new Promise(async(resolve,reject) =>{
		//確認有這筆資料
		const hasData = await checkBookData(orderList.id,orderList.owner_ID);;
		//確認訂單是否完成
		const hasComplete = await checkOrderComplete(orderList.id);


        const bookData = await getBookData(orderList.id);

        const BalanceEnough = await checkBalanceEnough(bookData.price,orderList.owner_ID);


		if(hasData === false){
		    result.status = "訂單完成失敗。";
            result.err = "沒有該訂單資料！";
            reject(result);
        } else if (hasComplete === false) {
            result.status = "訂單完成失敗。";
            result.err = "該訂單已交易。";
            reject(result);
        } else if (BalanceEnough === false) {
            result.status = "訂單完成失敗。";
            result.err = "用戶餘額不足";
            reject(result);
        }else if(hasData === true && hasComplete === true　&& BalanceEnough === true){
        	// 取得order_list的table資料


            //減少訂閲者的錢
            await db.query('UPDATE member,book SET member.balance = member.balance - book.price WHERE member.id = ? and book.id = ?;', [orderList.owner_ID,orderList.id], function (err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "訂單完成失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
            })

            //增加擁有著的錢
            await db.query('UPDATE member,book SET member.balance = member.balance + book.price WHERE member.id = ? and book.id = ?;', [bookData.owner_id,orderList.id], function (err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "訂單完成失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
            })

            //增加owner的錢

            // 將is_complete的訂單狀態改為1
            await db.query('UPDATE book SET is_complete = 1 WHERE id = ?', orderList.id, function (err, rows) {
                if (err) {
                    console.log(err);
                    result.status = "訂單完成失敗。"
                    result.err = "伺服器錯誤，請稍後在試！"
                    reject(result);
                    return;
                }
            })

            let currentBalance = await getBalance(orderList.owner_ID);
        result.status = `訂單編號：${orderList.id} 書名：${bookData.name} 您的餘額：${currentBalance.balance} 付款已完成，謝謝您使用該服務!`;
        resolve(result);
        }
    })
}






const checkBookData = (orderID, ownerID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM book WHERE id = ? ',orderID, function (err, rows) {
            if (rows[0] === undefined) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}



const checkOrderComplete = (orderID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT is_complete FROM book WHERE id = ?', orderID, function (err, rows) {
            if (rows[0].is_complete === 1) {
                console.log(rows)
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}


const getBookData = function (bookID) {
  //  memberID = 1;
    let bookData = {};
    return new Promise((resolve, reject) => {
        db.query('select * from book where id = ?', bookID, function(err, rows) {
            bookData.price = rows[0].price;
            bookData.owner_id = rows[0].owner_id;
            bookData.name = rows[0].name;
            console.log(bookData);
            resolve(bookData);
        })
    })
}


const getBalance = function (ownerID) {
  //  memberID = 1;
    let member = {};
    return new Promise((resolve, reject) => {
        db.query('select * from member where id = ?', ownerID, function(err, rows) {
            member.balance = rows[0].balance;
            console.log(member);
            resolve(member);
        })
    })
}


const checkBalanceEnough = (price,owner_ID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT balance FROM member WHERE id = ?', owner_ID, function (err, rows) {
            if (rows[0].balance < price) {
                console.log(rows)
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}