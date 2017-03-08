// Example of using rabbit.js as an easy version of AMQP. Not
// interactive: just fires lots of messages at RabbitMQ, consumes
// them, and reports on the results.
var rabbit = require('rabbit.js')
var config = require('../config/pubsub')

var ctx;

var pubSocket = null;

function pub() {
  ctx = rabbit.createContext(config.context)


  ctx.on('ready', function () {
    pubSocket = ctx.socket('PUB');
    pubSocket.connect(config.channel);
    console.log("Starting publisher at channel %s", config.channel);

  });
  ctx.on('error', console.warn);
}

function send(message) {
  console.log("message sent: %s", message);
  writable = pubSocket.write(message);
}

function sendTo(channel, message) {
  console.log(message);
  writable = ctx.socket(channel).write(message);
}

function pubTo(args) {
  var
    name = "PUB",
    context = config.context;

  console.log('args: %s', args)
  //name = args.name || name;
  channel = args.channel || config.channel;
  //context = args.context || context;

  publish(context, name, channel);
}


function publish(context, name, channel) {
  ctx = rabbit.createContext(context)

  ctx.on('ready', function () {
    pubSocket = ctx.socket(name);
    console.log("Starting publisher|channel: %s", channel);
    pubSocket.connect(channel);
  });
  ctx.on('error', console.warn);
}

module.exports = {
  pub: pub,
  pubTo: pubTo,
  send: send,
  sendTo: sendTo
}