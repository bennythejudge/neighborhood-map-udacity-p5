'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('app/js/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize Images
// gulp.task('images', function () {
//   return gulp.src('app/img/**/*')
//     .pipe($.cache($.imagemin({
//       progressive: true,
//       interlaced: true
//     })))
//     .pipe(gulp.dest('dist/images'))
//     .pipe($.size({title: 'images'}));
// });


// Watch Files For Changes & Reload
gulp.task('serve', function () {
  browserSync({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/*.html'], reload);
  gulp.watch(['app/css/*.{scss,css}'], [reload]);
  gulp.watch(['app/js/*.js'], ['jshint',reload]);
  // gulp.watch(['app/img/**/*'], reload);
});

// // Build Production Files, the Default Task
// gulp.task('default', ['clean'], function (cb) {
//   runSequence('styles', ['jshint', 'html', 'fonts', 'copy'], cb);
// });

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
// gulp.task('pagespeed', pagespeed.bind(null, {
//   // By default, we use the PageSpeed Insights
//   // free (no API key) tier. You can use a Google
//   // Developer API key if you have one. See
//   // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
//   url: 'https://example.com',
//   strategy: 'mobile'
// }));

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}
