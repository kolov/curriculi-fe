const cookiejar = require('cookiejar');

const PROXY_CONFIG = {
  "/authenticate": {
    "target": "https://bat.dev.tnt-digital.com",
    "headers": {
      "referer": "https://bat.dev.tnt-digital.com/"
    },
    "changeOrigin": true,
    "onProxyRes": disableSetCookieSecureAttribute
  },
  "/service": {
    "target": "https://bat.dev.tnt-digital.com",
    "headers": {
      "host": 'bat.dev.tnt-digital.com',
      "referer": "https://bat.dev.tnt-digital.com/"
    },
    "changeOrigin": true
  }
};

module.exports = PROXY_CONFIG;

/**
 * The set-cookie headers are 'secure' meaning you can only proxy them over the https protocol. This middleware removes
 * that secure setting so you can still use the 'set-cookie' headers when developing locally with http.
 */
function disableSetCookieSecureAttribute (proxyRes) {
  const originalHeaders = proxyRes.headers['set-cookie'] || [];

  proxyRes.headers['set-cookie'] = originalHeaders
    .map((str) => new cookiejar.Cookie(str))
    .map((cookie) => {
      cookie.secure = false;

      return cookie;
    })
    .map((cookie) => cookie.toString());
}
