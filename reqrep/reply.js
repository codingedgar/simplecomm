var rabbit = require('rabbit.js')

function rep() {
  var channel = "uppercase";
  var responseChannel = "upperresponse";

  var context = rabbit.createContext();

  context.on('ready', function () {

    var rep = context.socket('REP');
    rep.setEncoding('utf8');
    // Respond to incoming requests
    rep.on('data', function (msg) {
      console.log("reply: %s", msg)
      rep.write(msg.toUpperCase());
    });
    rep.connect(channel);

    console.log("connected to %s", channel)
  });
}

module.exports = {
  rep: rep
}