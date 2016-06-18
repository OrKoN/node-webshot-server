var webshot = require('../webshot')
  , should = require('should')
  , fs = require('fs')
  , im = require('imagemagick')
  , helper = require('../helper')
  , pngOutput = helper.pngOutput
  , fixtures = helper.fixtures;

describe('siteType', function() {
  this.timeout(20000);

  it('takes a screenshot of the provided html', function(done) {
    webshot('<html><body>This is a test</body></html>',
            pngOutput,
            {siteType: 'html'},
            function(err) {
      if (err) return done(err);
      fs.exists(pngOutput, function(exists) {
        exists.should.equal(true);
        done();
      });
    });
  });

  it('handles very large html strings', function(done) {
    var longString = Array(900000).join(' ');

    webshot(longString, pngOutput, {siteType:'html'}, function(err) {
      if (err) return done(err);
      fs.exists(pngOutput, function(exists) {
        exists.should.equal(true);
        done();
      });
    });
  });


  it('takes a screenshot given a local path', function(done) {
    helper.serve('/test/fixtures/2.html', done, (url, cb) => {
      webshot(url,
              pngOutput,
              { siteType: 'url' },
              function(err) {
        if (err) return cb(err);
        fs.exists(pngOutput, function(exists) {
          exists.should.equal(true);
          cb();
        });
      });
    });
  });
});
