'use strict';

// Include Gulp & Tools We'll Use
var $ = require('gulp-load-plugins')();
var notify = require('gulp-notify');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;
var pkg = require('./package.json');


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
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
});

// JSCS the javascript
gulp.task('jscs', function() {
    gulp.src('app/js/*.js')
        .pipe(jscs())
        .pipe(notify({
            title: 'JSCS',
            message: 'JSCS Passed. Let it fly!'
    }))
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
    notify: true,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/*.html'], reload);
  gulp.watch(['app/css/*.css'], [reload]);
  gulp.watch(['app/js/*.js'], ['jshint',reload]);
});

/**
 * build a production ready distribution
 */
gulp.task('build', function () {
  return gulp.src('./app/js/*.js')
    .pipe(concat(pkg.name + '.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

