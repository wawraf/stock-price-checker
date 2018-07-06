/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const url = 'https://www.alphavantage.co/query?'

const fetch = require('node-fetch')
let likes = [], stockData = {}, arr = [], inArr = []

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      const like = req.query.like || false;
      //console.log(req)
      const ip = req.headers['x-forwarded-for'].split(',')[0]
      let stock = req.query.stock
      
      if (stock === '') return res.type('text').send('invalid input')
    
      Array.isArray(stock) ? null : stock = [stock]
      stock = stock.map(item => item.toUpperCase())
      
      let api_data = {
        function: 'BATCH_STOCK_QUOTES',
        symbols: stock.join(","),
        apikey: process.env.API_KEY
      }
      
      let fetchData = `function=${api_data.function}&symbols=${api_data.symbols}&apikey=${api_data.apikey}`
      
      fetch(url + fetchData) // Call the fetch function passing the url of the API as a parameter
      .then(response => response.json())
      .then((data) => {
        // Your code for handling the data you get from the API
        //console.log(data['Stock Quotes'])
        arr = data['Stock Quotes'].map(item => (
          { stock: item['1. symbol'], price: item['2. price'] }
        )
        )
        
        if (arr.length == 0) return res.type('text').send('incorrect input')
        
      })
      .then(() => {
        arr.forEach((item) => {
          
          MongoClient.connect(CONNECTION_STRING, (err, db) => {
            db.collection('stock').findOne({stockName: item.stock}, (err, docs) => {
              if (err) throw (err)

              if (docs === null) {
                db.collection('stock')
                .insertOne({
                  stockName: item.stock,
                  likes: like ? 1 : 0,
                  ip: like ? [ip] : []
                }, (err, doc) => {
                  if (err) throw err
                  item.likes = doc.ops[0].likes
                  sendResponse(res, item)
                })
              } else {
                db.collection('stock')
                .findOneAndUpdate(
                  {stockName: item.stock},
                  (like && docs.ip.indexOf(ip) === -1) 
                  ? {$inc: {likes: 1}, $push: {ip: ip}}
                  : {$inc: {likes: 0}},
                  {returnOriginal: false},
                  (err, doc) => {
                    item.likes = doc.value.likes
                    sendResponse(res, item)
                  }
                )
              }
              
              db.close()
            })
          }) 
          
        })
        
        
      })
      .catch(err => console.log(err));
    
      const sendResponse = (res, item) => {
         if (arr.length == 1) {
           res.json({ stockData: item })
         } else if (arr.length == 2) {
           inArr.push(item)
           if (inArr.length == 2) {
             inArr[0].rel_likes = inArr[0].likes - inArr[1].likes
             inArr[1].rel_likes = inArr[1].likes - inArr[0].likes
             
             delete inArr[0].likes
             delete inArr[1].likes
             
             res.json({ stockData: inArr})
             inArr = [];
           }
         } else res.type('text').send('incorrect input')
      }
    
    
    
    });
  
};
