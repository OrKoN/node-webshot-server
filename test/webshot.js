'use strict';

const request = require('request');
const _ = require('lodash');
const extensions = ['jpeg', 'jpg', 'png', 'pdf'];
const siteTypes = ['url', 'html'];
const url = require('url');
const fs = require('fs');
var webshot = require('webshot-client');

module.exports = webshot('http://localhost:4556/');