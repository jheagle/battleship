const { build, defaultCmd, partials, readme, testFull, testQuick, typescript, watchFull, watchTest } = require('js-build-tools')
const cssnano = require('gulp-cssnano')
const { dest, series, src } = require('gulp')
const rename = require('gulp-rename')
const sassBase = require('sass')
const gulpSass = require('gulp-sass')
const sass = gulpSass(sassBase)

// Compile sass into CSS & auto-inject into browsers
const sassify = () => src('sass/**/*.+(scss|sass)')
  .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
  .pipe(dest('browser/css'))
  .pipe(cssnano())
  .pipe(rename({ extname: '.min.css' }))
  .pipe(dest('browser/css'))

exports.sass = sassify
exports.build = series(build, sassify)
exports.default = defaultCmd
exports.readme = readme
exports.testFull = testFull
exports.testQuick = testQuick
exports.watchFull = watchFull
exports.watchTest = watchTest
