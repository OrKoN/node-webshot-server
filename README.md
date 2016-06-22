# node-webshot-server

[![Version](https://img.shields.io/npm/v/webshot-server.svg)](https://www.npmjs.com/package/webshot-server)
[![Build Status](https://travis-ci.org/60devs/node-webshot-server.svg?branch=master)](https://travis-ci.org/60devs/node-webshot-server)
[![Downloads](https://img.shields.io/npm/dm/webshot-server.svg)](https://www.npmjs.com/package/webshot-server)
[![Dependencies](https://img.shields.io/david/60devs/node-webshot-server.svg)](https://github.com/60devs/node-webshot-server/blob/master/package.json#L19)

A simple server module that wraps [node-webshot](https://github.com/brenden/node-webshot)

## Installation

```
npm install webshot-server -g
```

## Installation via Docker

[https://hub.docker.com/r/orkon/node-webshot-server/](https://hub.docker.com/r/orkon/node-webshot-server/)

## Usage

```
npm install webshot-client
webshot-server
```

```js
var webshot = require('webshot-client')('http://localhost:8080/');
webshot('google.com', 'output.png', function(err) {
  // done
});

```

## Rebuilding the Docker image

```sh
docker build -t node-webshot-server .
```

## LICENSE

[MIT](LICENSE)
