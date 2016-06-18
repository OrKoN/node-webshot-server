exports.fixtures = [
  {
    path: 'file://' + __dirname + '/fixtures/1.html'
  , width: 1024
  , height: 999
  }
, {
    path: 'file://' + __dirname + '/fixtures/2.html'
  , width: 1024
  , height: 1000
  }
, {
    path: 'file://' + __dirname + '/fixtures/3.html'
  , width: 300
  , height: 250
  }
];

var pngOutput = exports.pngOutput = __dirname + '/test.png';
var pdfOutput = exports.pdfOutput = __dirname + '/test.pdf';

var fs = require('fs');

afterEach(function(done) {
  [pngOutput, pdfOutput].forEach(function(path) {
    try { fs.unlinkSync(path); } catch(err) {}
  });
  done();
});


exports.serve = function(file, done, cb) {
  var static = require('node-static');
  var fileServer = new static.Server();
  var s = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
      fileServer.serveFile(file, 200, {}, request, response);
    }).resume();
  });
  s.listen(8080, () => {
    cb('http://localhost:8080/', (err) => {
      s.close();
      done(err);
    });
  });
}