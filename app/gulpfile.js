const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const clean = require('del');
const ngTemplates = require('gulp-ng-templates');
const mainBowerFiles = require('main-bower-files');
var order = require("gulp-order");
const minify_css = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
const plugins = require("gulp-load-plugins");
const runSequence = require("run-sequence");
const replace = require("gulp-replace");


//tasks
const app = {
    clean: 'clean',
    src_compress : 'src_compress',
    customcss : 'customcss',
    vendor_uglify : 'vendor_uglify', 
    templates : 'templates',
    imagemin : 'imagemin',
    vendorcss : 'vendorcss'
}

gulp.task('build',function(){
        runSequence('app.clean',
        ['app.customcss',
        'app.src_compress',
        'app.templates',
        'app.vendor_uglify'],
        'app.vendorcss',
        'app.imagemin')
});

gulp.task('app.clean',function(){
    clean(["!dist/index.html","!dist/app.js","!dist/app-config.js","dist/asstes/*","dist/scripts/*","temp"])   
});

gulp.task('app.customcss',function(){
     gulp.src(['app/assets/css/*.css'])
     .pipe(minify_css())
     .pipe(concat('custom.min.css'))
     .pipe(gulp.dest('dist/assets/css'))
});


gulp.task('app.src_compress',function(){
    var controllers = ['app/controllers/**/*.js','app/controllers/*.js',
    'app/directives/*.js',
    'app/filters/*.js',
    'app/interceptors/*.js',
    'app/services/*.js',
    'app/services/**/*.js',
    '!app/controllers/homeController.js']
    gulp.src(controllers)
        .pipe(uglify())
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest('dist/scripts'))
});


gulp.task('app.assets',function(){
    gulp.src(['bower_components/modernizr/modernizr.js','app/assets/js/*.js','!app/assets/js/mainapp.js','!app/assets/js/main.js'])
    .pipe(uglify())
        .pipe(gulp.dest('temp'))
});

gulp.task('app.vendor',['app.assets'],function(){
   return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('temp'))
});
gulp.task('app.vendor_uglify',['app.vendor'], function() {
    gulp.src('temp/*.js')
        .pipe(order([
            "temp/jquery.js",
            "temp/angular.js",
            "temp/angular-animate.js",
            "temp/angular-aria.js",
            "temp/angular-material.js",
            "temp/angular-messages.js",
            "temp/angular-route.js",
            "temp/angular-ui-router.js",
            "temp/ng-map.js",
            "temp/angular-touch.js",
            "temp/bootstrap.js",
            "temp/markerclusterer.js",
            "temp/slick.js",
            "temp/angular-toastr.tpls.js",
            "temp/ng-file-upload.js",
            "temp/underscore.js",
            "temp/moment.js",
            "temp/ui-grid.js",
            "temp/FileSaver.js",
            "temp/angular-file-saver.bundle.js",
            "temp/angular-carousel.js",
            "temp/ajax-googleapis.js",
            "temp/angular-slick.js",
            "temp/angular-ui-bootstrap.js",
            "temp/ng-google-chart.js",
            "temp/oms.min.js",
            "temp/popper.js",
            "temp/hammer.js",
            "temp/modernizr.js",
            "temp/satellizer.min.js",
            "temp/vs-google-autocomplete.js"
        ], { base: './' }))
        .pipe(uglify())
        .pipe(concat("app.vendor.min.js"))
        .pipe(gulp.dest('dist/scripts'))
})

gulp.task('app.vendorcss', function() {
    gulp.src('temp/*.css')
    .pipe(order([
        "temp/angular-material.css",
        "temp/angular-toastr.css",
        "temp/slick.css"
    ], { base: './' }))
    .pipe(minify_css())
    .pipe(concat("app.vendor.css"))
    .pipe(gulp.dest('dist/scripts'))
});


gulp.task('app.templates',function(){
    gulp.src(['app/layouts/*.html','app/views/**/*.html','app/views/*.html'])
    .pipe(ngTemplates({
        module: 'bbManager',
        path: function (path, base) {
            var split = base.split('\\');
            var replacedPath = (split[split.length-2]) + '/';
            return path.replace(base, replacedPath).replace('/templates', '');
        }
    }))
    .pipe(gulp.dest('dist/scripts'))
})

gulp.task('app.imagemin', function() {
    var imgSrc = ['app/assets/images/*','app/assets/images/**/*','app/assets/mobile-icons/*'],
    imgDst = 'dist/assets/images';
    gulp.src(imgSrc)
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
 });