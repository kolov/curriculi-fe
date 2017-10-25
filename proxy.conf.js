const cookiejar = require('cookiejar');

const PROXY_CONFIG = {
  "/authenticate": {
    "target": "https://xxx",
    "headers": {
      "referer": "https://xxx/"
    },
    "changeOrigin": true,
    "onProxyRes": disableSetCookieSecureAttribute
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
