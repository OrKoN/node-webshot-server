'use strict';

const webshot = require('webshot');
const schema = require('./schema/api');
const Ajv = require('ajv');
const ajv = Ajv({ useDefaults: true });
const validate = ajv.compile(schema);

function getParams(chunks) {
  try {
    return JSON.parse(chunks.join(''));
  } catch (err) {
    console.error(err);
    return null;
  }
}

function valid(params) {
  if (params === null) {
    return null;
  }

  if (!validate(params)) {
    return null;
  }

  return params;
}

function handler(request, response) {
  if (request.url === '/' && request.method == 'POST') {
    const chunks = [];
    request.on('data', chunk => chunks.push(chunk.toString()));
    request.on('error', () => {
      response.statusCode = 500;
      response.end();
    });
    request.on('end', () => {
      const params = valid(getParams(chunks));
      if (params === null) {
        response.statusCode = 400;
        response.end();
        return;
      }
      const renderStream = webshot(params[params.siteType], params);
      response.writeHead(200, { 'Content-Type': 'image/png' });
      renderStream.on('data', data => response.write(data.toString('binary'), 'binary'));
      renderStream.on('end', () => response.end());
      renderStream.on('error', () => {
        response.statusCode = 422;
        response.end();
      });
    });
    return;
  }
  response.statusCode = 400;
  response.end();
}

module.exports = handler;