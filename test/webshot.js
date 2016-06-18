'use strict';

const request = require('request');
const _ = require('lodash');
const extensions = ['jpeg', 'jpg', 'png', 'pdf'];
const siteTypes = ['url', 'html'];
const url = require('url');
const fs = require('fs');

module.exports = (...args) => {
  // Process arguments
  var cb = null;
  var options = {};
  var path = null;

  /*
    Possible valid arguments:
    SITE, <OPTIONS>, CB
    SITE, <OPTIONS>
    SITE, PATH, <OPTIONS>, CB
  */
  var site = args.shift();

  /*
    <OPTIONS>, CB
    <OPTIONS>
    PATH, <OPTIONS>, CB
  */
  var last = args[args.length - 1];

  if (Object.prototype.toString.call(last) == '[object Function]') {
    cb = args.pop();
  }

  /*
    <OPTIONS>
    <OPTIONS>
    PATH, <OPTIONS>
  */
  switch (args.length) {

    case 1:
      var arg = args.pop();

      if (toString.call(arg) === '[object String]') {
        path = arg;
      } else {
        options = arg;
      }
    break;

    case 2:
      path = args.shift();
      options = args.shift();
    break;
  }

  var streaming = !path;

  // Check that a valid fileType was given for the output image
  var extension = (path)
    ? path.substring(~(~path.lastIndexOf('.') || ~path.length) + 1)
    : 'png';

  if (!~extensions.indexOf(extension.toLowerCase())) {
    return cb(
      new Error('All files must end with one of the following extensions: '
        + extensions.join(', ')));
  }

  var json = _.defaults({}, options, {
    siteType: 'url',
  });
  if (json.siteType === 'url') {
    json.url = url.parse(site).protocol ? site : 'http://' + site;
  } else {
    json.html = site;
  }
  const req = {
    uri: 'http://localhost:4556/',
    method: 'POST',
    json,
    encoding: 'binary',
  };

  if (streaming) {
    var stream = request(req);
    var error = false;
    var statusCode = 0;
    stream.on('data', data => {
      if (error) {
        try {
          var json = JSON.parse(data.toString('utf-8'));
          stream.emit('error', new Error(json.message));
        } catch (err) {
          stream.emit('error', new Error(statusCode));
        }
      }
    });
    stream.on('response', response => {
      if (response.statusCode !== 200) {
        error = true;
        statusCode = response.statusCode;
      }
    });
    if (cb) {
      return cb(null, stream);
    }
    return stream;
  } else {
    request(req, (err, response, body) => {
      if (err) {
        return cb(err);
      }
      if (response.statusCode !== 200) {
        return cb(new Error(body ? body.message : 'Unknown error happened'));
      }
      fs.writeFile(path, body, 'binary', cb);
    });
  }
};