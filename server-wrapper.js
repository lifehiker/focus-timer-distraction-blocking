// Ensure uncaught synchronous exceptions are logged before the process exits.
// The while-loop in CMD will restart the server automatically.
// (--unhandled-rejections=none already covers async rejections.)
process.on('uncaughtException', function (err) {
  console.error('[server] Uncaught exception:', err && err.message ? err.message : err);
  process.exit(1);
});

require('./server.js');
