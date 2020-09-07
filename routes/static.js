const router = rootRequire('helpers/router.js');

function serveStaticFile(ctx, folder, file) {
  const send = require('koa-send');
  const path = require('path');
  const fs = require('fs');

  if (file.length === 0 || file === '/' || !fs.existsSync(folder.substr(1) + file)) { return; }

  ctx.cacheControl = {
    maxAge: 60 * 60 * 24 * 8
  };

  return send(ctx, file, { root: path.resolve(global.rootPath + folder) });
}

router.get('/assets/(.*)', (ctx) => {
  const path = require('path');
  const requested = path.normalize(ctx.params[0]);

  return serveStaticFile(ctx, '/public/assets/', requested);
});
