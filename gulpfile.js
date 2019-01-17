// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const gulp = require("gulp");
const header = require("gulp-header");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' * Modified by trevDev - www.trevdev.ca\n',
  ' */\n',
  '\n'
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function (cb) {

  // Bootstrap
  gulp.src([
    './node_modules/bootstrap/dist/**/*',
    '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
    '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
  ])
    .pipe(gulp.dest('./build/vendor/bootstrap'))

  // Font Awesome
  gulp.src([
    './node_modules/@fortawesome/**/*',
  ])
    .pipe(gulp.dest('./build/vendor'))

  // jQuery
  gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ])
    .pipe(gulp.dest('./build/vendor/jquery'))

  // jQuery Easing
  gulp.src([
    './node_modules/jquery.easing/*.js'
  ])
    .pipe(gulp.dest('./build/vendor/jquery-easing'))

  cb();

});

// CSS task
function css() {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded"
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./build/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./build/css"))
}

// JS task
function js() {
  return gulp
    .src([
      './src/js/*.js'
    ])
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/js'))
}

// Images

const imageSources = [
  './src/img/*.jpg',
  './src/img/*.png'
]

function img() {
  return gulp
    .src(imageSources)
    .pipe(imagemin())
    .pipe(gulp.dest('./build/img'));
}

// Update PHP files

function php() {
  return gulp
    .src('./src/php/**/*.php')
    .pipe(gulp.dest('./build'))
}

// Tasks
gulp.task("css", css);
gulp.task("js", js);
gulp.task("img", img)
gulp.task("php", php)


// Watch files
function watchFiles() {
  gulp.watch("./src/scss/**/*", css);
  gulp.watch(["./src/js/**/*.js", "!./js/*.min.js"], js);
  gulp.watch(imageSources, img);
  gulp.watch('./src/php/**/*.php', php);
}

gulp.task("default", gulp.parallel('vendor', css, js, img, php));

// dev task
gulp.task("dev", gulp.parallel(watchFiles));
