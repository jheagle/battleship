const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync')
const useref = require('gulp-useref')
const uglify = require('gulp-uglify')
const gulpIf = require('gulp-if')
const cssnano = require('gulp-cssnano')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const del = require('del')
const runSequence = require('run-sequence')
const babel = require('gulp-babel')
const prepack = require('gulp-prepack');

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: 'src'
    }
  })
})

gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.+(scss|sass)') // Gets all files ending with .scss in src/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(gulp.dest('src/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }))
})

// Watchers
gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.+(scss|sass)', ['sass'])
  gulp.watch('src/*.html', ['useref', browserSync.reload])
  gulp.watch('src/js/**/*.js', ['useref', browserSync.reload])
})

// Optimization Tasks
// ------------------

// Optimizing CSS and JavaScript
gulp.task('useref', function () {
  return gulp.src('src/*.html')
    .pipe(useref())
    // .pipe(gulpIf('*.js', prepack()))
    .pipe(gulpIf('*.js', babel({
      presets: ['es2015']
    })))
    // .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
})

// Optimizing Images
gulp.task('images', function () {
  return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/img'))
})

// Copying fonts
gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

// Cleaning
gulp.task('clean', function () {
  return del.sync('dist').then(function (cb) {
    return cache.clearAll(cb)
  })
})

gulp.task('clean:dist', function () {
  return del.sync(['dist/**/*', '!dist/img', '!dist/img/**/*'])
})

// Build Sequences
// ---------------

gulp.task('default', function (callback) {
  runSequence(
    'sass',
    ['useref', 'browserSync'],
    'watch',
    callback
  )
})

gulp.task('build', function (callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'images', 'fonts'],
    callback
  )
})
