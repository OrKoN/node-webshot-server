'use strict';

const webshot = require('webshot');
const schema = require('./schema/api');
const Ajv = require('ajv');
const ajv = Ajv({ useDefaults: true });
const validate = ajv.compile(schema);
const logger = require('winston');
const _ = require('lodash');

function getParams(chunks) {
  try {
    return JSON.parse(chunks.join(''));
  } catch (err) {
    logger.error(`Error during parsing params`, err);
    return null;
  }
}

function valid(params) {
  logger.info('Validating params', _.omit(params, [ 'html' ]));
  if (params === null) {
    return null;
  }

  if (!validate(params)) {
    return null;
  }

  return params;
}

function handler(request, response) {
  logger.info('Request', request.url, request.method);
  if (request.url === '/' && request.method == 'POST') {
    const chunks = [];
    request.on('data', chunk => chunks.push(chunk.toString()));
    request.on('error', err => {
      logger.error('request error', err)
      response.statusCode = 500;
      response.end();
    });
    request.on('end', () => {
      const params = getParams(chunks);
      logger.info('Request::params', _.omit(params, ['html']));
      const validParams = valid(params);
      if (validParams === null) {
        response.statusCode = 400;
        response.end();
        return;
      }
      const renderStream = webshot(validParams[validParams.siteType], validParams);
      logger.info('renderStream::capturing with params', JSON.stringify(_.omit(validParams, [ 'html' ]), null, 2));
      let count = 0;
      let error = 0;
      renderStream.on('data', data => {
        if (!error) {
          logger.info('renderStream::onData', data.length, count);
          if (count === 0) {
            response.writeHead(200, { 'Content-Type': 'image/' + validParams.streamType });
          }
          count++;
          require('fs').writeFileSync('test.png', data);
          response.write(data);
        }
      });
      renderStream.on('end', () => {
        if (!error) {
          logger.info('renderStream::onEnd ' + count);
          if (count === 0) {
            response.writeHead(422);
          }
          response.end();
        }
      });
      renderStream.on('error', err => {
        error = true;
        logger.error('renderStream::onError', err);
        logger.info('renderStream::onError Setting 500 status');
        response.writeHead(500, { 'Content-Type': 'application/json' });
        logger.info('renderStream::onError sending error message: ' + JSON.stringify({ message: err.message }));
        response.end(JSON.stringify({ message: err.message }));
      });
    });
    return;
  }
  response.statusCode = 400;
  response.end();
}

module.exports = handler;