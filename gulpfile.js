var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssToJs = require('gulp-css-to-js');
var minifyCss = require('gulp-minify-css');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var watch = require('gulp-watch');

gulp.task('default', function () {
  return gulp.src('src/**/*.css')
    .pipe(watch('src/**/*.css', convertCss));
});

gulp.task('build', ['convert-css'], function () {
  return merge(gulp.src('src/kolor-picker.js'), gulp.src('build/kolor-picker.css.js'))
    .pipe(concat('kolor-picker.js'))
    .pipe(gulp.dest('build'))
    .pipe(concat('kolor-picker.min.js'))
    .pipe(uglify({ preserveComments: 'license' }))
    .pipe(gulp.dest('build'));
});

gulp.task('convert-css', convertCss);

function convertCss() {
  return merge(getBaseCss(), getThemeCss())
    .pipe(concat('kolor-picker.css.js'))
    .pipe(gulp.dest('build'));
}

function getBaseCss() {
  return gulp.src('src/kolor-picker.css')
    .pipe(minifyCss({ compatibility: 'ie8' }))
    .pipe(cssToJs({ variable: '$.kolorPicker.css' }));
}

function getThemeCss() {
  var streams = [];
  getFiles('src/theme').forEach(function(file) {
    var theme = file.split('.')[0];
    var variable = '$.kolorPicker.theme.' + theme;
    var stream = gulp.src('src/theme/' + file)
      .pipe(minifyCss({ compatibility: 'ie8' }))
      .pipe(cssToJs({ variable: variable }))
      .pipe(insert.append(variable + '=$.kolorPicker.css+' + variable + ';'));
    streams.push(stream);
  });
  return streams;
}

function getFiles(folder) {
  return fs.readdirSync(folder).filter(function(file) {
    return fs.statSync(path.join(folder, file)).isFile();
  });
}
