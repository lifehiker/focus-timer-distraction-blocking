// Keep the process alive if Next.js throws an uncaught synchronous exception
// (--unhandled-rejections=none already covers async rejections).
process.on('uncaughtException', function (err) {
  console.error('[server] Uncaught exception (continuing):', err && err.message ? err.message : err);
});

// Prevent Next.js 16 from calling process.exit(1) when it receives a
// Server Action POST with an unknown action ID ("Failed to find Server Action").
// Without this, every stale-client probe kills the server and the Docker
// health check races against the restart loop.
process.exit = function (code) {
  console.error('[server] process.exit(' + (code || 0) + ') suppressed — server continuing');
};

require('./server.js');
