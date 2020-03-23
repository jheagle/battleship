const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const cache = require('gulp-cache')
const concat = require('gulp-concat')
const cssnano = require('gulp-cssnano')
const del = require('del')
const gulp = require('gulp')
const gulpIf = require('gulp-if')
const imagemin = require('gulp-imagemin')
const uglify = require('gulp-uglify-es').default
const useref = require('gulp-useref')
const sass = require('gulp-sass')

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
  gulp.watch('src/sass/**/*.+(scss|sass)', gulp.series('sass'))
  gulp.watch('src/*.html', gulp.series('useref')).on('change', browserSync.reload)
  gulp.watch('src/js/**/*.js', gulp.series('useref')).on('change', browserSync.reload)
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => gulp.src('src/sass/**/*.+(scss|sass)')
  .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.stream())
)

// Optimizing CSS and JavaScript
gulp.task('useref', () => gulp.src('src/*.html')
  .pipe(useref())
  .pipe(gulpIf('*.js', babel({
    presets: ['@babel/preset-env']
  })))
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulpIf('*.css', cssnano()))
  .pipe(gulp.dest('dist'))
)

// Build vendor file
gulp.task('vendor', () => gulp.src([
  'node_modules/json-dom/browser/json-dom.min.js'
])
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('src/js/vendor'))
  .pipe(gulp.dest('dist/js/vendor'))
)

// Optimizing Images
gulp.task('images', () =>
  gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/img'))
)

// Copying fonts
gulp.task('fonts', () => gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts')))

// Cleaning
gulp.task('clean', async () => {
  await del('dist')
  cache.clearAll()
})

gulp.task('clean:dist', () => del(['dist/**/*', '!dist/img', '!dist/img/**/*']))

gulp.task('default', gulp.series(
  'sass',
  'useref',
  'vendor',
  'browser-sync'
)
)

gulp.task('build', gulp.series(
  'clean:dist',
  'sass',
  gulp.parallel('useref', 'images', 'fonts'),
  'vendor'
)
)
