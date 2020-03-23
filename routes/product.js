const router = rootRequire('helpers/router.js');
const { renderTemplate } = rootRequire('helpers/utils.js');

router.post('/product',
  (ctx, next) => {
    const { CrawlingAPI } = require('proxycrawl');
    const data = ctx.request.body;
    const api = new CrawlingAPI({ token: data.token });

    return api
      .get(data.url, { scraper: 'amazon-product-details' })
      .then(response => {
        if (response.statusCode !== 200) {
          throw new Error('Invalid ProxyCrawl status code: ' + response.statusCode + '\n' + response.body);
        } else {
          ctx.product = JSON.parse(response.body).body;
          console.log('Available product properties: ', ctx.product);
        }
        next();
      })
      .catch(err => {
        console.error(err);
        ctx.error = err;
        next();
      });
  },
  (ctx) => ctx.body = renderTemplate('product', { error: ctx.error, product: ctx.product }));
