// ////////////////////////////////////////////////
// REQUIRES
// ////////////////////////////////////////////////
var watchify      = require('watchify');
var browserify    = require('browserify');
var browserSync   = require('browser-sync');
var gulp          = require('gulp');
var source        = require('vinyl-source-stream');
var buffer        = require('vinyl-buffer');
var gutil         = require('gulp-util');
var uglify        = require('gulp-uglify');
var sass          = require('gulp-sass');
var pug           = require('gulp-pug');
var autoprefixer  = require('gulp-autoprefixer');
var del           = require('del');


// ////////////////////////////////////////////////
// Javascript Tasks
// ////////////////////////////////////////////////
// add custom browserify options here
var customOpts = {
  entries: ['./src/js/index.js'],
  debug: true,
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()

    // log errors if they happen
    .on('error', gutil.log.bind(gutil, gutil.colors.red(
       '\n\n*********************************** \n' +
      'BROWSERIFY ERROR:' +
      '\n*********************************** \n\n'
    )))

}

// ////////////////////////////////////////////////
// Browser-Sync Tasks
// ////////////////////////////////////////////////
gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: './public/',
    },
  });
});

// ////////////////////////////////////////////////
// HTML Tasks
// ////////////////////////////////////////////////
gulp.task('html', function () {
  return gulp.src('public/**/*.html')
    .pipe(browserSync.reload({ stream: true }));
});


// ////////////////////////////////////////////////
// Styles Tasks
// ///////////////////////////////////////////////
gulp.task('styles', function () {
  gulp.src('src/scss/app.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .on('error', gutil.log.bind(gutil, gutil.colors.red(
       '\n\n*********************************** \n' +
      'SASS ERROR:' +
      '\n*********************************** \n\n'
      )))
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false,
    }))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({ stream: true }));
});

// ////////////////////////////////////////////////
// Views / PUG Tasks
// ///////////////////////////////////////////////
gulp.task('views',  function buildHTML() {
  gulp.src('src/pug/**/*.pug')

    .on('error', gutil.log.bind(gutil, gutil.colors.red(
       '\n\n*********************************** \n' +
      'SASS ERROR:' +
      '\n*********************************** \n\n'
      )))
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false,
    }))
    .pipe(gulp.dest('public/'))
    .pipe(browserSync.reload({ stream: true }));
});


// ////////////////////////////////////////////////
// Watch Tasks
// ////////////////////////////////////////////////
gulp.task('watch', function () {
  gulp.watch('public/**/*.html', ['html']);
  gulp.watch('src/scss/**/*.scss', ['styles']);
  gulp.watch('src/pug/**/*.pug', ['views']);
});

gulp.task('default', ['js', 'styles', 'views', 'browserSync', 'watch']);
