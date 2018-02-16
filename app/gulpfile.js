const gulp = require('gulp');
const minify = require('gulp-uglify');

gulp.task('default',function(){
    console.log('testing the gulp runner');
});
gulp.task('compress',function(){
    gulp.src('node_modules/angular/angular.js')
    .pipe(minify())
    .pipe(gulp.dest('dist/scripts'))
})