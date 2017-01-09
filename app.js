'user strict';

const express = require('express');
var portfinder = require('portfinder');
var bodyParser = require('body-parser');

//App
const app = express();
var rabbitctx = require('./publish');

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

global['port'] = 8000;

function startSequential() {
  portfinder.getPort(function (err, port) {
    // `port` is guaranteed to be a free port in this scope.
    app.on('error', (err) =>
      console.log('there was an error:', err.message)
    )
    startProject(port);
  });
}


function startProject(port) {
  app.listen(port);
  global.port = port;
  console.log('Running on http://localhost:' + port);
  if (true) {
    console.log(global.port)
    if (global.port == 8001) {
      rabbitctx.sub()
    }
    else if (global.port == 8002) {
      rabbitctx.pub();
    }
  }
}

// print process.argv
function readArgs() {

  var readLocalhost = false;
  var port = 8000;
  process.argv.forEach(function (val, index, array) {
    if (val == 'localhost') {
      readLocalhost = true;
    }

    if (readLocalhost) {
      port = val;
    }
  });

  if (readLocalhost) {
    startProject(port);
  }
  else {
    startSequential();
  }
}

readArgs();

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
      rabbitctx.pub();
      break;
    case "sub to":
      rabbitctx.sub(req.body.message);
      break;
    case "send":
      rabbitctx.send(req.body.message);
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