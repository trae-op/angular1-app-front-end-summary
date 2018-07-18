

var gulp = require('gulp');
var flatten = require('gulp-flatten');
var serve = require('gulp-serve');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var ngAnnotate = require('gulp-ng-annotate');

var devFolder = 'dev/';
var destFolder = './public/';
var bowerComponentsFolder = devFolder + 'bower_components/';

gulp.task('copyCss', function() {
    return gulp.src([
        devFolder + 'css/bower-styles.css',
        devFolder + 'css/styles.css'
    ])
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(destFolder + 'css'));
});

gulp.task('copyJs', function() {
    return gulp.src([
        devFolder + 'js/compiled/bower-scripts.js',
        devFolder + 'js/compiled/app.js'
    ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destFolder + 'scripts'));
});

gulp.task('copyFaviconIcon', function() {
    return gulp.src(devFolder + 'favicon.ico')
        .pipe(gulp.dest(destFolder));
});

gulp.task('copyImages', function() {
    return gulp.src(devFolder + 'images/**/*')
        .pipe(gulp.dest(destFolder + 'images'));
});

gulp.task('copyParts', function() {
    return gulp.src(devFolder + 'parts/**/*.html')
        .pipe(gulp.dest(destFolder + 'parts'));
});

gulp.task('copyJson', function() {
    return gulp.src(devFolder + 'js/**/*.json')
        .pipe(gulp.dest(destFolder + 'js'));
});
// copy production configuration files
gulp.task('copyConfig', function() {
    return gulp.src([
        devFolder + 'config.js'
    ])
        .pipe(gulp.dest(destFolder));
});

// copy custom fonts
gulp.task('copyFonts', function() {
    return gulp.src(devFolder + 'fonts/**/*.*')
        .pipe(gulp.dest(destFolder + 'fonts'));
});

gulp.task('fonts', function() {
    return gulp.src(bowerComponentsFolder + '/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(flatten())
        .pipe(gulp.dest(devFolder + 'fonts'));
});

gulp.task('lintjs', function() {
    return gulp.src([
        'gulpfile.js',
        devFolder + 'js/code/**/*.js'
    ])
        .pipe(jshint({
            linter: 'jshint'
        }))
        .pipe(jshint.reporter(stylish));
});


gulp.task('bowerBuildCss', function() {
    return gulp.src([
        bowerComponentsFolder + 'font-awesome/css/font-awesome.css',
        bowerComponentsFolder + 'bootstrap-css-only/css/bootstrap.min.css',
        bowerComponentsFolder + 'bootstrap-social/bootstrap-social.css'
    ])
        .pipe(concat('bower-styles.css'))
        .pipe(gulp.dest(devFolder + 'css/'));
});

gulp.task('sass', function () {
    return gulp.src('./dev/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(devFolder + 'css/'));
});

gulp.task('bowerBuildJs', function() {
    return gulp.src([
        bowerComponentsFolder + 'lodash/dist/lodash.min.js',
        bowerComponentsFolder + 'angular/angular.min.js',
        bowerComponentsFolder + 'angular-bootstrap/ui-bootstrap.min.js',
        bowerComponentsFolder + 'angular-bootstrap/ui-bootstrap-tpls.js',
        bowerComponentsFolder + 'angular-sanitize/angular-sanitize.min.js',
        bowerComponentsFolder + 'angular-route/angular-route.min.js',
        bowerComponentsFolder + 'ngstorage/ngStorage.min.js',
        bowerComponentsFolder + 'angular-facebook/lib/angular-facebook.js',
        bowerComponentsFolder + 'ng-google-signin/dist/ng-google-signin.min.js'
    ])
        .pipe(concat('bower-scripts.js'))
        .pipe(gulp.dest(devFolder + 'js/compiled/'));
});

gulp.task('scripts', function() {
    return gulp.src([
        devFolder + 'js/code/**/*.js'
    ])
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(devFolder + 'js/compiled/'));
});

gulp.task('copy', [
    'copyCss',
    'copyJs',
    'copyParts',
    'copyFaviconIcon',
    'copyImages',
    'copyJson',
    'copyFonts',
    'fonts',
    'copyConfig'
]);

gulp.task('build:dev:css', ['bowerBuildCss', 'sass']);
gulp.task('build:dev:js', ['bowerBuildJs', 'scripts']);
gulp.task('build:dev', ['build:dev:css', 'build:dev:js', 'fonts']);
gulp.task('build:prod', ['copy']);

gulp.task('serve:dev', serve('dev'));
gulp.task('serve:prod', serve('public'));

gulp.task('serve:dev:build', ['build:dev', 'serve:dev']);
gulp.task('serve:prod:build', ['build:prod', 'serve:prod']);