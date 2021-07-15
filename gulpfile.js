const babel = require('gulp-babel')
const browserify = require('browserify')
const browserSync = require('browser-sync').create()
const buffer = require('vinyl-buffer')
const cache = require('gulp-cache')
const cssnano = require('gulp-cssnano')
const del = require('del')
const eslint = require('gulp-eslint')
const gulp = require('gulp')
const imagemin = require('gulp-imagemin')
const rename = require('gulp-rename')
const sass = require('gulp-sass')(require('sass'))
const source = require('vinyl-source-stream')
const uglify = require('gulp-uglify-es').default

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: 'browser'
    }
  })
  gulp.watch('src/sass/**/*.+(scss|sass)', gulp.series('sass'))
  gulp.watch('src/*.html', gulp.series('dist:quick', 'bundle:quick')).on('change', browserSync.reload)
  gulp.watch('src/js/**/*.js', gulp.series('dist:quick', 'bundle:quick')).on('change', browserSync.reload)
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => gulp.src('src/sass/**/*.+(scss|sass)')
  .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
  .pipe(gulp.dest('browser/css'))
  .pipe(cssnano())
  .pipe(rename({ extname: '.min.css' }))
  .pipe(gulp.dest('browser/css'))
  .pipe(browserSync.stream())
)

// Optimizing CSS and JavaScript
gulp.task('dist:quick', () => gulp.src('src/js/**/*.js')
  .pipe(babel())
  .pipe(gulp.dest('dist'))
)

gulp.task('bundle:quick', () => browserify('dist/main.js')
  .bundle()
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(gulp.dest('browser/js'))
)

gulp.task('dist', () => gulp.src('src/js/**/*.js')
  .pipe(babel())
  .pipe(eslint({ fix: true }))
  .pipe(eslint.format())
  .pipe(gulp.dest('dist'))
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest('dist'))
)

gulp.task('bundle', () => browserify('dist/main.js')
  .bundle()
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(eslint({ fix: true }))
  .pipe(eslint.format())
  .pipe(gulp.dest('browser/js'))
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest('browser/js'))
)

gulp.task('html', () => gulp.src('src/*.html')
  .pipe(gulp.dest('browser'))
)

// Build vendor file
gulp.task('vendor', () => browserify([
  'node_modules/functional-helpers/dist/main.js',
  'node_modules/json-dom/dist/main.js'
])
  .bundle()
  .pipe(source('vendor.js'))
  .pipe(buffer())
  .pipe(eslint({ fix: true }))
  .pipe(eslint.format())
  .pipe(gulp.dest('src/js/'))
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest('dist/js/'))
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
gulp.task('clean:dist', () => del(['dist/**/*', '!dist/img', '!dist/img/**/*']))
gulp.task('clean:browser', () => del(['browser/**/*', '!browser/img', '!browser/img/**/*']))
gulp.task('clean:cache', () => cache.clearAll())
gulp.task('clean', gulp.parallel('clean:dist', 'clean:browser', 'clean:cache'))

gulp.task(
  'default',
  gulp.series(
    gulp.parallel('sass', 'dist:quick', 'html'),
    'bundle:quick',
    'browser-sync'
  )
)

gulp.task(
  'quick',
  gulp.series(
    gulp.parallel('sass', 'dist:quick', 'html'),
    'bundle:quick'
  )
)

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel('sass', 'dist', 'html'),
    gulp.parallel('bundle', 'images', 'fonts')
  )
)
