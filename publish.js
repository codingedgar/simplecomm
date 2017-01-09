// Example of using rabbit.js as an easy version of AMQP. Not
// interactive: just fires lots of messages at RabbitMQ, consumes
// them, and reports on the results.
var rabbit = require('rabbit.js')

var ctx;

function start() {
  ctx = rabbit.createContext('amqp://developer:developer@localhost:5672')


  ctx.on('ready', function () {

    var running = true;
    var pub = ctx.socket('PUB');
    var sub = ctx.socket('SUB');

    var now = process.hrtime(), since = now;
    var i = 0, j = 0;
    var lasti = 0, lastj = 0;

    function report() {
      var elapsed = process.hrtime(since);
      since = process.hrtime();
      var secs = elapsed[0] + elapsed[1] * Math.pow(10, -9);
      var sent = j - lastj, recv = i - lasti;
      lasti = i; lastj = j;
      console.log('Sent: %d at %d msg/s, Recv: %d at %d msg/s on port %d',
        sent, (sent / secs).toFixed(1),
        recv, (recv / secs).toFixed(1),
        global.port);
    }

    function finish() {
      running = false;
      var since = process.hrtime(now);
      report();
      ctx.close();
    }
    process.on('SIGINT', finish);

    sub.connect('easyamqp', function () {
      console.log("Starting consumer...");

      function recv() {
        while (sub.read()) {
          i++;
        }
      }
      sub.on('readable', recv);

      pub.connect('easyamqp', function () {
        console.log("Starting publisher...");

        var writable = true;
        function send() {
          while (running && (writable = pub.write('foobar'))) {
            j++;
            if (j % 5000 === 0) {
              report();
              break; // give recv a chance
            }
          }
          if (running && writable) setImmediate(send);
          else {
            //console.log('Waiting for drain at %d', j);
          }
        }
        pub.on('drain', send);
        send();
      });

    });

  });
  ctx.on('error', console.warn);
}

var subSocket = null;

var counter = 0;

function sub() {
  ctx = rabbit.createContext('amqp://developer:developer@localhost:5672')

  ctx.on('ready', function () {
    subSocket = ctx.socket('SUB');

    subSocket.connect('easyamqp', function () {
      console.log("Starting consumer...");

      subSocket.on('data', recv);
    });
  });
  ctx.on('error', console.warn);
}

function recv(data) {
  counter++;
  console.log("data: %s, counter: %s", data, counter)
}

function stop() {
  running = false;
  var since = process.hrtime(now);
  report();
  ctx.close();
}

var pubSocket = null;

function pub() {
  ctx = rabbit.createContext('amqp://developer:developer@localhost:5672')


  ctx.on('ready', function () {
    pubSocket = ctx.socket('PUB');
    console.log("Starting publisher...");
    pubSocket.connect('easyamqp');
  });
  ctx.on('error', console.warn);
}

function send(message) {
  console.log(message);
  writable = pubSocket.write(message)
}

module.exports = {
  start: start,
  sub: sub,
  pub: pub,
  stop: stop,
  send: send
}