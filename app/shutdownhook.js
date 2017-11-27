// required for proper handling of docker stop/kill signals
const signals = {
  'SIGINT': 2,
  'SIGTERM': 15
};

module.exports.register = (server) => {
    Object.keys(signals).forEach(function (signal) {
      process.on(signal, () => {
        console.log('server stopped by ' + signal);
        server.close();
        process.exit(0);
      });
    });
}