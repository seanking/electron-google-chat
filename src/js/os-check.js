/**
 * Identify if the OS is Windows.
 *
 * @return {boolean} True if the OS is Windows.
 */
exports.isWindows = function() {
  return process.platform === 'win32';
};

/**
 * Identify if the OS is macOS.
 *
 * @return {boolean} True if the OS is macOS.
 */
exports.isMacOS = function() {
  return process.platform === 'darwin';
};
