// Intercept http.createServer BEFORE loading Next.js so we can short-circuit
// POST requests that carry a Next-Action header.  These come from stale
// browser clients or Coolify deploy probes and would cause Next.js 16 to call
// process.exit(1) (or close its HTTP server), making the health check fail.
const http = require('http');
const _origCreateServer = http.createServer.bind(http);
http.createServer = function (opts, handler) {
  if (typeof opts === 'function') { handler = opts; opts = {}; }
  function wrappedHandler(req, res) {
    if (req.method === 'POST' && req.headers['next-action']) {
      console.error('[server] Blocked stale Next-Action probe:', req.headers['next-action']);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Server Action not found' }));
      return;
    }
    return handler(req, res);
  }
  return _origCreateServer(opts, wrappedHandler);
};

require('./server.js');
