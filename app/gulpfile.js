const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const ngTemplates = require('gulp-ng-templates');
const mainBowerFiles = require('main-bower-files');
var order = require("gulp-order");
const minify_css = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
const plugins = require("gulp-load-plugins");
const runSequence = require("run-sequence");
var inject = require('gulp-inject');
var svgmin = require('gulp-svgmin');


//tasks
const app = {
    clean: 'clean',
    src_compress : 'src_compress',
    app_config : 'app_config',
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
        'app.app_config',
        'app.imagemin',
        'app.index')
});

gulp.task('app.clean',function(){
   return gulp.src(['temp','dist'], {read: false})
    .pipe(clean())  
});

gulp.task('app.customcss',function(){
    return gulp.src(['app/assets/css/*.css'])
     .pipe(minify_css())
     .pipe(concat('custom.min.css'))
     .pipe(gulp.dest('dist/assets/css'))
});

/*starttag: '"{{ext}}": [',
    endtag: ']',
    transform: function (filepath, file, i, length) {
      return '  "' + filepath + '"' + (i + 1 < length ? ',' : '');
    }*/

gulp.task('app.index', function () {
  return gulp.src('app/index.html')
  .pipe(inject(gulp.src([
		'dist/scripts/vendor.min.js',
		'dist/scripts/app.min.js', 
		'dist/scripts/templates.min.js',
		'dist/scripts/app.vendor.css',
		'dist/assets/css/custom.min.css',
	], {read: false}), {
    transform: function(filepath, file, i, length) {
        var tmp = filepath.split('/');
		tmp.splice(0, 2);
		if (tmp[tmp.length - 1].indexOf('js') != -1) {
			return "<script src='" + tmp.join('/') + "'></script>";
		} else if (tmp[tmp.length - 1].indexOf('css') != -1) {
			return "<link rel='stylesheet' href='" + tmp.join('/') + "'>";
		}
	}
  }))
  .pipe(gulp.dest('dist'));
});


gulp.task('app.app_config', function(){
    return gulp.src('app/app-config.js')
            .pipe(uglify())
            .pipe(concat('app-config.js'))
            .pipe(gulp.dest('dist'))
})

gulp.task('app.src_compress',function(){
    var controllers = [
		'app/app.js',
		'app/controllers/**/*.js',
		'app/controllers/*.js',
		'app/directives/*.js',
		'app/filters/*.js',
		'app/interceptors/*.js',
		'app/services/*.js',
        'app/services/**/*.js',
		'!app/controllers/homeController.js'
	]
    return gulp.src(controllers)
        .pipe(uglify())
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest('dist/scripts'))
});


gulp.task('app.assets',function(){
   return gulp.src(['bower_components/modernizr/modernizr.js',
    'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
    'app/assets/js/*.js',
    '!app/assets/js/mainapp.js',
    '!app/assets/js/main.js'])
    .pipe(uglify())
        .pipe(gulp.dest('temp'))
});

gulp.task('app.vendor',['app.assets'],function(){
   return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('temp'))
});
gulp.task('app.vendor_uglify',['app.vendor'], function() {
   return gulp.src('temp/*.js')
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
            "temp/ng-file-upload-shim.min.js",
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
            "temp/popper.min.js",
            "temp/hammer.js",
            "temp/modernizr.js",
            "temp/satellizer.min.js",
            "temp/vs-google-autocomplete.js"
        ], { base: './' }))
        .pipe(uglify())
        .pipe(concat("vendor.min.js"))
        .pipe(gulp.dest('dist/scripts'))
})

gulp.task('app.vendorcss', function() {
   return gulp.src(['temp/*.css',  
    'bower_components/bootstrap/dist/css/bootstrap.min.css']
)
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
   return gulp.src(['app/layouts/*.html','app/views/**/*.html','app/views/*.html'])
    .pipe(ngTemplates({
        module: 'bbManager',
		standalone: false,
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
   return gulp.src(imgSrc)
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
 });

 gulp.task('app.testsvg',function(){
    return gulp.src('app/assets/images/*.svg')
        .pipe(svgmin(
            {
                plugins: [{
                    removeDoctype: false
                }, {
                    removeComments: false
                }, {
                    cleanupNumericValues: {
                        floatPrecision: 2
                    }
                }, {
                    convertColors: {
                        names2hex: false,
                        rgb2hex: false
                    }
                }]
            }
        ))
        .pipe(gulp.dest('dist/assets/testimg'))
})