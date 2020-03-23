const router = rootRequire('helpers/router.js');
const { renderTemplate } = rootRequire('helpers/utils.js');

router.get('/', (ctx) => {
  ctx.body = renderTemplate('index');
});
