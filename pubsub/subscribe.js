// Example of using rabbit.js as an easy version of AMQP. Not
// interactive: just fires lots of messages at RabbitMQ, consumes
// them, and reports on the results.
var rabbit = require('rabbit.js')
var config = require('../config/pubsub')

var ctx;


var subSocket = null;

var counter = 0;

function sub() {
  ctx = rabbit.createContext(config.context)

  ctx.on('ready', function () {
    subSocket = ctx.socket('SUB');

    subSocket.connect(config.channel, function () {
      console.log("Starting consumer at channel %s",config.channel);

      subSocket.on('data', recv);
    });
  });
  ctx.on('error', console.warn);
}

function recv(data) {
  counter++;
  console.log("data: %s, counter: %s", data, counter)
}

function subTo(args) {
  var
    name = "SUB",
    context = config.context;

  //name = args.name || name;
  channel = args.channel || config.channel;
  //context = args.context || context;

  subscribe(context, name, channel);

  console.log("Starting subscriber...");
}

function subscribe(context, name, channel) {
  ctx = rabbit.createContext(context)

  ctx.on('ready', function () {
    subSocket = ctx.socket(name);

    subSocket.connect(channel, function () {
      console.log("Starting consumer|channel: %s", channel);

      subSocket.on('data', recv);
    });
  });
  ctx.on('error', console.warn);
}

module.exports = {
  sub: sub,
  subTo: subTo,
}