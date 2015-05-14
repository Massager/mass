var browserify = require('browserify');
var gulp = require('gulp');
var sass = require('gulp-sass');
var source = require("vinyl-source-stream");
var reactify = require('reactify');

gulp.task('default', function(){
  var b = browserify();
  b.transform(reactify); // use the reactify transform
  b.add('./src/app.js');
  return b.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('sass', function () {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function(){
  // watch other files, for example .less file
  gulp.watch(['src/*', 'src/*/*', 'scss/*'], ['default', 'sass']);
});