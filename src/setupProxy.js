const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/graphql', { target: 'http://localhost:4000/graphql', changeOrigin: true, secure: false }));
  app.use(proxy('/api', { target: 'http://dp-inntekt-api:8099/', changeOrigin: true, secure: false }));
};
