/**
 * Global helpers
 */

global.rootPath = __dirname.replace('/helpers', '');

/**
 * Requires a file from root
 * @param  {string} name
 */
global.rootRequire = (name) => {
  return require(global.rootPath + '/' + name);
};
