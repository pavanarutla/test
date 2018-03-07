var gulp = require('gulp'); // Require gulp

// Sass dependencies
var sass = require('gulp-sass'); // Compile Sass into CSS
var minifyCSS = require('gulp-minify-css'); // Minify the CSS

// Minification dependencies
var minifyHTML = require('gulp-minify-html'); // Minify HTML
var concat = require('gulp-concat'); // Join all JS files together to save space
var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs
var uglify = require('gulp-uglify'); // Minify JavaScript
var imagemin = require('gulp-imagemin'); // Minify images

// Other dependencies
var del = require('del');
var gutil = require('gulp-util');
var pump = require('pump');
var size = require('gulp-size'); // Get the size of the project
var browserSync = require('browser-sync'); // Reload the browser on file changes
var jshint = require('gulp-jshint'); // Debug JS files
var stylish = require('jshint-stylish'); // More stylish debugging

// Tasks -------------------------------------------------------------------- >

// Task to clean the distributable directory
gulp.task('app.clean',function(){
  return del([
    'build',
    // we don't want to clean this file though so we negate the pattern
    '!bulid/index.html'
  ]);
});

// Task to compile Sass file into CSS
gulp.task('compile-scss', function() {
  gulp.src('./app/assets/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/assets/css/'));
});

// Task to minify CSS into build directory
gulp.task('styles', ['compile-scss'], function() {
  gulp.src('./app/assets/css/*.css')
  .pipe(minifyCSS())
  .pipe(gulp.dest('./build/styles/'))
  .pipe(browserSync.reload({
    stream: true,
  }));
});

// Task to minify new or changed HTML pages
gulp.task('html', function() {
  gulp.src(['./app/views/**/*.html', './app/layouts/**/*.html'])
    .pipe(minifyHTML())
    .pipe(gulp.dest('./build/views/'));
});

// Task to concat, strip debugging and minify JS files
gulp.task('scripts', function() {
  gulp.src(['./app/assets/js/*.js', 
            './app/app.js', 
            './app/controllers/**/*.js', 
            './app/services/**/*.js',
            './app/directives/*.js',
            './app/filters/*.js',
            './app/interceptors/*.js',
            '!./app/app-config.js'
  ])
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('./build/scripts/'));
});

// Task to minify images into build
// gulp.task('images', function() {
//   gulp.src('./app/images/*')
//   .pipe(imagemin({
//     progressive: true,
//   }))
//   .pipe(gulp.dest('./build/images'));
// });

// Task to run JS hint
gulp.task('jshint', function() {
  gulp.src(['./app/assets/js/*.js', 
    './app/app.js', 
    './app/controllers/**/*.js', 
    './app/services/**/*.js',
    './app/directives/*.js',
    './app/filters/*.js',
    './app/interceptors/*.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// gulp.task('uglify-error-debugging', function (cb) {
//   pump([
//     gulp.src(['./app/assets/js/*.js', 
//       './app/app.js', 
//       './app/controllers/**/*.js', 
//       './app/services/**/*.js',
//       './app/directives/*.js',
//       './app/filters/*.js',
//       './app/interceptors/*.js',
//     ]),
//     uglify(),
//     gulp.dest('./dist/')
//   ], cb);
// });

// Task to get the size of the app project
gulp.task('size', function() {
  gulp.src('./app/**')
	.pipe(size({
    showFiles: true,
  }));
});

// Task to get the size of the build project
gulp.task('build-size', function() {
  gulp.src('./build/**')
  .pipe(size({
    showFiles: true,
  }));
});

// Serve application
gulp.task('serve', ['styles', 'html', 'jshint', 'scripts', 'size'], function() {
  browserSync.init({
    server: {
      baseDir: 'app',
    },
  });
});

// Run all Gulp tasks and serve application
gulp.task('default', ['serve', 'styles'], function() {
  gulp.watch('./app/assets/css/*.scss', ['styles']);
  gulp.watch(['./app/layouts/**/*.html', './app/views/**/*.html'], browserSync.reload);
  gulp.watch(['./app/assets/js/*.js', 
    './app/app.js', 
    './app/controllers/**/*.js', 
    './app/services/**/*.js',
    './app/directives/*.js',
    './app/filters/*.js',
    './app/interceptors/*.js',
  ], browserSync.reload);
});