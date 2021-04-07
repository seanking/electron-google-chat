const {isMacOS, isWindows} = require('./os-check');

/* eslint max-len: ["error", { "ignoreStrings": true }]*/
/**
 * Provides a Chrome user agent for the OS.
 *
 * @return {string} The user agent
 */
exports.userAgent = function() {
  if (isMacOS()) {
    return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36';
  } else if (isWindows()) {
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36';
  } else {
    return 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36';
  }
};
