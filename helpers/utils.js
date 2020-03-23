/**
 * Renders the template with Pug
 * @param  {string} viewName View name without extension
 * @param  {object} data
 * @return {string}
 */
function renderTemplate(viewName, data) {
  const pug = require('pug');
  const pugOptions = {
    filters: {
      assetURL: text => '/assets/' + text,
    },
    pretty: true
  };
  const compiledFunction = pug.compileFile('./views/' + viewName + '.pug', pugOptions);

  data = data || {};
  // Add filters as functions to be able to use them as javascript
  Object.assign(data, pugOptions.filters);

  return compiledFunction(data);
}

module.exports = {
  renderTemplate
};
