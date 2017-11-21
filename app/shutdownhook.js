// required for proper handling of docker stop/kill signals
const signals = {
  'SIGINT': 2,
  'SIGTERM': 15
};

module.exports.register = (server) => {
    Object.keys(signals).forEach(function (signal) {
      process.on(signal, () => {
        server.close((server) => {
            console.log('server stopped by ' + signal);
            process.exit(0);
        });
      });
    });
}