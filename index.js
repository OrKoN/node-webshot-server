#! /usr/bin/env node

'use strict';

const http = require('http');
const PORT = 8080;
const handler = require('./lib/handler');
const server = http.createServer(handler);
server.listen(PORT, () => console.log("Server listening on: http://localhost:%s", PORT));