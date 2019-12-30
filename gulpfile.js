const gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  useref = require('gulp-useref'),
  uglify = require('gulp-uglify-es').default,
  gulpIf = require('gulp-if'),
  cssnano = require('gulp-cssnano'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  del = require('del'),
  babel = require('gulp-babel')

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
gulp.task('clean', (
  async () => {
    await del('dist')
    cache.clearAll()
  })
)

gulp.task('clean:dist', (
  async () =>
    await del(['dist/**/*', '!dist/img', '!dist/img/**/*'])
))

gulp.task('default', gulp.series(
  'sass',
  'useref',
  'browser-sync',
  )
)

gulp.task('build', gulp.series(
  'clean:dist',
  'sass',
  gulp.parallel('useref', 'images', 'fonts'),
  )
)
