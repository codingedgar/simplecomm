var rabbit = require('rabbit.js')

function req() {
  var channel = "uppercase";
  var message = "hola";

  var context = rabbit.createContext();

  context.on('ready', function () {

    var req = context.socket('REQ');
    // Piping into a SockJS socket means that our REQ socket is closed
    // when the SockJS socket is, so there's no clean-up needed.

    req.on('data', function (msg) {
      console.log("reply: %s", msg)
    }
    );

    req.connect(channel, function () {
      // ferry requests and responses back and forth
      req.write(message)

      console.log("wrote message: %s", message)
    });
  });

  console.log("connected to %s", channel)

}

module.exports = {
  req: req
}