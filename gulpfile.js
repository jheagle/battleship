const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const useref = require('gulp-useref')
const uglify = require('gulp-uglify')
const gulpIf = require('gulp-if')
const cssnano = require('gulp-cssnano')
const babel = require('gulp-babel')

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browser-sync', (done) => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
  gulp.watch('src/sass/**/*.+(scss|sass)', gulp.series('sass'))
  gulp.watch('src/*.html', gulp.series('useref')).on('change', browserSync.reload)
  gulp.watch('src/js/**/*.js', gulp.series('useref')).on('change', browserSync.reload)
  done()
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

gulp.task('default', gulp.series('browser-sync'))
