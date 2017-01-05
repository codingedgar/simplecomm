'user strict';

const express = require('express');
var portfinder = require('portfinder');
var bodyParser = require('body-parser');

//App
const app = express();

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


portfinder.getPort(function (err, port) {
  // `port` is guaranteed to be a free port in this scope.
  app.listen(port);
  console.log('Running on http://localhost:' + port);
});

var rabbitctx = require('./publish');

//rabbitctx.ctx;

app.set('view engine', 'pug')
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

// POST method route
app.post('/', function (req, res) {
  var
    command = req.body.command,
    message = "";

  message = command + " executed ";

  switch (command) {
    case "start":
      rabbitctx.start();
      break;
    case "stop":
      rabbitctx.stop();
      break;
    case "sub":
      rabbitctx.sub();
      break;
    case "pub":
      rabbitctx.pub(req.body.message);
      break;
    case "sub to":
      rabbitctx.sub(req.body.message);
      break;
    case "send":
      break;
    case "send":
      break;
    case "send":
      break;
    default:
      message += "default"
      break;
  }
  res.send(message)
})