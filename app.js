'user strict';

const express = require('express');
var portfinder = require('portfinder');
var bodyParser = require('body-parser');

//App
const app = express();
// var rabbitctx = require('./publish');
var rabbitPubSub = require('./pubsub');
var rabbitReqRep = require('./reqrep');


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
  /*
  if (true) {
    console.log(global.port)
    if (global.port == 8001) {
      rabbitctx.sub()
    }
    else if (global.port == 8002) {
      rabbitctx.pub();
    }
  }
  */
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
      rabbitPubSub.test.start();
      break;
    case "stop":
      rabbitPubSub.test.stop();
      break;
    case "sub":
      rabbitPubSub.sub.sub();
      break;
    case "subTo":
      rabbitPubSub.sub.subTo(req.body);
      break;
    case "pub":
      rabbitPubSub.pub.pub();
      break;
    case "send":
      rabbitPubSub.pub.send(req.body.message);
      break;
    case "pubTo":
      rabbitPubSub.pub.pubTo(req.body);
      break;
    case "sendTo":
      rabbitPubSub.pub.sendTo(req.body.channel, req.body.message);
      break;
    case "req":
      rabbitReqRep.req.req();
      break;
    case "rep":
      rabbitReqRep.rep.rep();
      break;
    default:
      message += "default"
      break;
  }
  console.log(message);
  res.send(message)
})