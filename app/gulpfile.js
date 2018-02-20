const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const clean = require('del');
const ngTemplates = require('gulp-ng-templates');
const mainBowerFiles = require('main-bower-files');
var order = require("gulp-order");
const minify_css = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');


//tasks
const app = {
    clean: 'clean',
    src_compress : 'src_compress',
    assets : 'assets',
    mincss : 'mincss',
    vendor_uglify : 'vendor_uglify', 
    templates : 'templates',
    imagemin : 'imagemin'
}

gulp.task('build',['app.clean','app.mincss','app.assets','app.src_compress','app.templates','app.vendor_uglify','app.imagemin'],function(){
    console.log('testing the gulp runner');
});

gulp.task('app.clean',function(){
    clean(["dist/scripts","temp"])   
});

gulp.task('app.mincss',function(){
     gulp.src(['app/assets/css/*.css'])
     .pipe(minify_css())
     .pipe(concat('style.min.css'))
     .pipe(gulp.dest('dist/scripts/styles'))
});


gulp.task('app.src_compress',function(){
    var controllers = ['app/app.js', 
                        'app/app-config.js',
                        'app/**/*.js',
                        'app/**/**/*.js']
    gulp.src(controllers)
        .pipe(uglify())
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest('dist/scripts'))
});


gulp.task('app.assets',function(){
    gulp.src(['app/assets/js/*.js'])
    .pipe(uglify())
    .pipe(concat("app.assets.min.js"))
        .pipe(gulp.dest('dist/scripts'))
});

gulp.task('app.vendor',function(){
   return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('temp'))
});
gulp.task('app.vendor_uglify',['app.vendor'], function() {
    gulp.src('temp/*.js')
        .pipe(order([
            "temp/jquery.js",
            "temp/angular.js",
            "temp/satellizer",
            "temp/angular-animate.js",
            "temp/angular-aria.js",
            "temp/angular-material",
            "temp/angular-messages",
            "temp/angular-route.js",
            "temp/angular-ui-router.js",
            "temp/ng-map.js",
            "temp/angular-touch.js",
            "temp/bootstrap.js",
            "temp/slick.js",
            "temp/angular-toastr.tpls.js",
            "temp/ng-file-upload.js",
            "temp/underscore.js",
            "temp/moment.js",
            "temp/ui-grid.js",
            "temp/FileSaver.js",
            "temp/angular-file-saver.bundle.js"
        ], { base: './' }))
        .pipe(concat("app.vendor.min.js"))
        .pipe(gulp.dest('dist/scripts'))
})

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
    imgDst = 'dist/images';
    gulp.src(imgSrc)
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
 });