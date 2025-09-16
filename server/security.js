// Small help to add secure-ish headers for static + proxy
module.exports = function security(app) {
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'no-referrer');
    // Camera/Media requires HTTPS; CSP kept permissive for local dev
    res.setHeader('Content-Security-Policy',
      "default-src 'self' blob: data:; " +
      "img-src 'self' data: blob:; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "connect-src 'self' http: https:;"
    );
    next();
  });
};
