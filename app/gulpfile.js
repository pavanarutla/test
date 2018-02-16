const gulp = require('gulp');
const minify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const clean = require('del');

//tasks
const app = {
    clean: 'clean',
    compress : 'compress'
}

gulp.task('run',['app.clean','app.compress'],function(){
    console.log('testing the gulp runner');
});

gulp.task('app.clean',function(){
    clean(["dist/scripts/*.min.js"])   
});

gulp.task('app.compress',function(){
    var controllers = ['app/controllers/admin/AdminLocationCtrl.js']
    gulp.src(controllers)
        .pipe(minify())
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest('dist/scripts'))
});