const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const ngTemplates = require('gulp-ng-templates');
const mainBowerFiles = require('main-bower-files');
var mainNodeFiles = require('gulp-main-node-files');
var order = require("gulp-order");
const minify_css = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
const plugins = require("gulp-load-plugins");
const runSequence = require("run-sequence");
var inject = require('gulp-inject');
var svgmin = require('gulp-svgmin');
var gnf = require('gulp-npm-files');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');
var watch = require('gulp-watch');



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
        'app.vendor_uglify',
		 ],
		 'app.vendorcss',
        'app.app_config',
        'app.imagemin',     
        'app.index','watch')
});

gulp.task('watch', function () {
    watch([
        'app/app.js',
        'app/controllers/**/*.js',
		'app/controllers/*.js',
		'app/directives/*.js',
		'app/filters/*.js',
		'app/interceptors/*.js',
		'app/services/*.js',
        'app/services/**/*.js'
    ], function () {
        gulp.start('app.src_compress');		
    });
    watch(['app/assets/js/*'],function(){
        gulp.start('app.vendor_uglify');
    })
    watch('app/index.html',function(){
        gulp.start("app.index");
    });
    watch('app/assets/css/*.css',function(){
        gulp.start('app.customcss');
    });
    watch('app/assets/css/vendor/*.css',function(){
        gulp.start('app.vendorcss');
    });
    watch(['app/layouts/*.html','app/views/**/*.html','app/views/*.html'],function(){
        gulp.start("app.templates");
    });
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
        'app/app-config.js',
        'app/controllers/**/*.js',
		'app/controllers/*.js',
		'app/directives/*.js',
		'app/filters/*.js',
		'app/interceptors/*.js',
		'app/services/*.js',
        'app/services/**/*.js',
	]
    return gulp.src(controllers)
        .pipe(uglify())
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest('dist/scripts'))
});


var required = [
            "jquery.min.js",
            "angular.min.js",
            "angular-animate.min.js",
            "angular-aria.min.js",
            "angular-material.min.js",
            "angular-messages.min.js",
            "angular-route.min.js",
            "angular-ui-router.min.js",
            "ng-map.min.js",
            "angular-touch.min.js",
            "bootstrap.min.js",
            "markerclusterer.js",
            "slick.min.js",
            "angular-toastr.tpls.min.js",
            "ng-file-upload.min.js",
            "ng-file-upload-shim.min.js",
            "underscore-min.js",
            "moment.min.js",
            "ui-grid.min.js",
            "FileSaver.min.js",
            "angular-file-saver.bundle.min.js",
            "angular-carousel.min.js",
            "ajax-googleapis.js",
            "angular-slick.min.js",
            "angular-ui-bootstrap.js",
            "ng-google-chart.js",
            "oms.min.js",
            "popper.min.js",
            "hammer.min.js",
            "modernizr.min.js",
            "satellizer.min.js",
            "vs-google-autocomplete.js"
		];


gulp.task('app.vendor_uglify', function() {
    var asstes = "app/assets/js/*js"
    return gulp.src(asstes)
        .pipe(order(required))
        .pipe(concat("vendor.min.js"))
        .pipe(gulp.dest('dist/scripts'))
})


var cssSrc = [
    'angular-material.min.css',
    'bootstrap.min.css',
    'font-awesome.min.css',
    'angular-toastr.min.css',
    'slick.min.css',
    'slick-theme.min.css',
    'ui-grid.min.css'
]

gulp.task('app.vendorcss', function() {
    var cssAssetes = "app/assets/css/vendor/*.css";
   return gulp.src(cssAssetes)
    .pipe(order(cssSrc))
    .pipe(concat("app.vendor.css"))
    .pipe(gulp.dest('dist/scripts'))
});


gulp.task('app.templates',function(){
   return gulp.src(['app/layouts/*.html','app/views/admin/*.html','app/views/owner/*.html','app/views/*.html'])
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

//  gulp.task('webserver', function() {
//     gulp.src('dist')
//       .pipe(webserver({
//         fallback: 'index.html',
//         livereload: true,
//         directoryListing: true,
//         open: true
//       }));
//   });

//  gulp.task('app.testsvg',function(){
//     return gulp.src('app/assets/images/*.svg')
//         .pipe(svgmin(
//             {
//                 plugins: [{
//                     removeDoctype: false
//                 }, {
//                     removeComments: false
//                 }, {
//                     cleanupNumericValues: {
//                         floatPrecision: 2
//                     }
//                 }, {
//                     convertColors: {
//                         names2hex: false,
//                         rgb2hex: false
//                     }
//                 }]
//             }
//         ))
//         .pipe(gulp.dest('dist/assets/testimg'))
// })