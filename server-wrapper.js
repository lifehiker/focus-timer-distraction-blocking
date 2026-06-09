// Keep the process alive if Next.js throws an uncaught synchronous exception
// (--unhandled-rejections=none already covers async rejections).
process.on('uncaughtException', function (err) {
  console.error('[server] Uncaught exception (continuing):', err && err.message ? err.message : err);
});

require('./server.js');
