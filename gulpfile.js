const gulp = require('gulp');
const minifyCSS = require('gulp-csso');
const sass = require('gulp-sass');
const del = require('del');
const once = require('gulp-once');
const gulpFn = require('gulp-fn');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
sass.compiler = require('node-sass');

const assetsFolder = './public/assets';

function getModulePaths() {
  var modules = [];

  glob.sync(assetsFolder + '/js/pages/**/*.js', { nonull: false }).forEach((file) => {
    if (file.indexOf('webpack-entry-module.js') !== -1) { return; }
    file = path.normalize(path.relative(assetsFolder + '/js', file));
    file = file.replace(/\\/g, '/');
    modules.push(file);
  });

  return modules;
}

function getWebpackEntryModuleBootstrapCode(modules) {
  const template = '' +
    '// webpack-load-module (autogeneraged with gulp)\n\n' +
    'window.loadModule = (moduleName) => {\n' +
    'switch(moduleName) {\n' +
    '//MODULE_CASES_STUB\n' +
    'default: throw new Error(\'Unknown module: \' + moduleName);\n' +
    '}\n' +
    '};';
  const cases = [];
  modules.forEach((module) => cases.push('case "' + module + '": require("./' + module + '"); break;'));

  return template.replace('//MODULE_CASES_STUB', cases.join('\n'));
}

const css = () => {
  return gulp.src('styles/*.scss')
    .pipe(once())
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCSS())
    .pipe(gulp.dest(`${assetsFolder}/css`));
};

const js = () => {
  return gulp.src('javascripts/**/*.js')
    .pipe(once())
    .pipe(gulp.dest(`${assetsFolder}/js`));
};

const webpackEntryModules = gulp.series(js, () => {
  return gulp.src('./gulpfile.js') // Unique file to run once
    .pipe(once())
    .pipe(gulpFn(() => fs.writeFileSync(assetsFolder + '/js/webpack-entry-module.js', getWebpackEntryModuleBootstrapCode(getModulePaths()))));
});

const devJsWebpack = gulp.series(webpackEntryModules, () => {
  return gulp.src(`${assetsFolder}/js/webpack-entry-*.js`)
    .pipe(once())
    .pipe(webpackStream(require('./config/webpack.dev.js'), webpack))
    .pipe(gulp.dest(`${assetsFolder}/js`));
});

const clean = cb => del([assetsFolder], cb);
const cleanCache = (cb) => del(['.checksums'], cb);

gulp.task('watch', () => {
  gulp.watch([ 'styles/**/*.{css,scss}' ], gulp.series(cleanCache, css));
  gulp.watch([ 'javascripts/**/*.js' ], gulp.series('default'));
});
gulp.task('clean', clean);
gulp.task('default', gulp.series(cleanCache, gulp.parallel(css, js), webpackEntryModules, devJsWebpack));
