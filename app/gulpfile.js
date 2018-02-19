const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const clean = require('del');
const ngTemplates = require('gulp-ng-templates');
const mainBowerFiles = require('main-bower-files');
var order = require("gulp-order");


//tasks
const app = {
    clean: 'clean',
    compress : 'compress',
    templates : 'templates'
}

gulp.task('run',['app.clean','app.compress','app.vendor.uglify','app.templates'],function(){
    console.log('testing the gulp runner');
});

gulp.task('app.clean',function(){
    clean(["dist","temp"])   
});

gulp.task('app.compress',function(){
    var controllers = ['app/app.js', 
                        'app/app-config.js',
                        'app/**/*.js',
                        'app/**/**/*.js']
    gulp.src(controllers)
        .pipe(uglify())
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest('dist/scripts'))
});

gulp.task('app.vendor',function(){
    gulp.src(mainBowerFiles())
        .pipe(gulp.dest('temp'))
});
gulp.task('app.vendor.uglify', ['app.vendor'], function() {
    gulp.src('temp/*.js')
        .pipe(order([
            "temp/jquery.js",
            "temp/angular.js",
            "temp/angular-animate.js",
            "temp/angular-aria.js",
            "temp/angular-material",
            "temp/angular-messages",
             "temp/angular-route.js",
             "temp/angular-ui-router.js",
            "temp/bootstrap.js",
        ], { base: './' }))
        .pipe(concat("app.vendor.min.js"))
        .pipe(gulp.dest('dist/scripts'))
})

gulp.task('app.templates',function(){
    gulp.src(['app/views/**/*.html','app/views/*.html'])
    .pipe(ngTemplates('bbManager'))
    .pipe(gulp.dest('dist/scripts'))
})