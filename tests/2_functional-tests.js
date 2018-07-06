/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData', 'stockData available')
          assert.property(res.body.stockData, 'stock', 'stock property available')
          assert.property(res.body.stockData, 'price', 'price property available')
          assert.property(res.body.stockData, 'likes', 'likes property available')
          assert.isNotArray(res.body.stockData, 'stockData is not an array')
          assert.equal(res.body.stockData.stock, 'GOOG')
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'dust', like: true})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData', 'stockData available')
          assert.property(res.body.stockData, 'stock', 'stock property available')
          assert.property(res.body.stockData, 'price', 'price property available')
          assert.property(res.body.stockData, 'likes', 'likes property available')
          assert.isNotArray(res.body.stockData, 'stockData is not an array')
          assert.equal(res.body.stockData.likes, 1)
          assert.equal(res.body.stockData.stock, 'DUST')
          done()
        })
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'dust', like: true})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData', 'stockData available')
          assert.property(res.body.stockData, 'stock', 'stock property available')
          assert.property(res.body.stockData, 'price', 'price property available')
          assert.property(res.body.stockData, 'likes', 'likes property available')
          assert.isNotArray(res.body.stockData, 'stockData is not an array')
          assert.equal(res.body.stockData.likes, 1)
          assert.equal(res.body.stockData.stock, 'DUST')
          done()
        })
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['fb', 'goog']})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData', 'stockData available')
          assert.isArray(res.body.stockData, 'stockData is an array')
          assert.property(res.body.stockData[0], 'stock', 'stock property available')
          assert.property(res.body.stockData[0], 'price', 'price property available')
          assert.property(res.body.stockData[0], 'rel_likes', 'rel_likes property available')
          assert.property(res.body.stockData[1], 'stock', 'stock property available')
          assert.property(res.body.stockData[1], 'price', 'price property available')
          assert.property(res.body.stockData[1], 'rel_likes', 'rel_likes property available')
          assert.equal(res.body.stockData[0].stock, 'FB')
          assert.equal(res.body.stockData[1].stock, 'GOOG')
          assert.equal(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 0);
          done()
        })
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['fb', 'goog'], like: true})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData', 'stockData available')
          assert.isArray(res.body.stockData, 'stockData is an array')
          assert.property(res.body.stockData[0], 'stock', 'stock property available')
          assert.property(res.body.stockData[0], 'price', 'price property available')
          assert.property(res.body.stockData[0], 'rel_likes', 'rel_likes property available')
          assert.property(res.body.stockData[1], 'stock', 'stock property available')
          assert.property(res.body.stockData[1], 'price', 'price property available')
          assert.property(res.body.stockData[1], 'rel_likes', 'rel_likes property available')
          assert.equal(res.body.stockData[0].stock, 'FB')
          assert.equal(res.body.stockData[1].stock, 'GOOG')
          assert.equal(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 0);
          done()
        })
      });
      
    });
    
});
