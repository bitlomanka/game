var gulp = require("gulp"),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),    
    browserSync = require('browser-sync'),
    postcss = require('gulp-postcss'),    
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    jade = require('gulp-jade'),
    plumber = require('gulp-plumber'),
    compass = require('gulp-compass');

// jade
gulp.task('jade', function() {
  var YOUR_LOCALS = {};
 
  return gulp.src('app/source/jade/pages/*.jade')
    .pipe(plumber())
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: '\t'
    }))
    .pipe(gulp.dest('app/source/'))
});

gulp.task('compass', function() {
  return gulp.src('app/source/sass/**/*.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: './config.rb',
      css: 'app/source/css',
      sass: 'app/source/sass',
      image: 'app/source/images'
    }))
});


// css/js/html
gulp.task('html', ['jade', 'compass'], function () {
    return gulp.src('app/source/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', postcss([
                autoprefixer({ browsers: ['last 2 versions'] }),
                cssnano
            ])
         ))        
        .pipe(gulp.dest('app/build'));
});

// картинки
gulp.task('images', function () {
  return gulp.src('app/source/images/**/*.*')
    .pipe(gulp.dest('app/build/images'));
});

// шрифты
gulp.task('fonts', function () {
  return gulp.src('app/source/fonts/**/*.*')
    .pipe(gulp.dest('app/build/css'));
});
    
// сервер dev
gulp.task('devServer', function () {  
  browserSync({
    port: 9000,
    server: {
      baseDir: 'app/source'
    }
  });
});

// сервер build
gulp.task('server', function () {  
  browserSync({
    port: 9000,
    server: {
      baseDir: 'app/build'
    }
  });
});

// слежка
gulp.task('watch', function () {    
  gulp.watch(['app/source/jade/**/*.jade'], ['jade', browserSync.reload]);
  gulp.watch(['app/source/sass/**/*.scss'], ['compass', browserSync.reload]);
  gulp.watch(['app/source/js/**/*.js'], [browserSync.reload]);
}); 


// сборка
gulp.task('build', ['html', 'images', 'fonts'], function(){
    gulp.start('server');
});

// таск по умолчанию
gulp.task('default', ['jade', 'compass', 'devServer', 'watch']);
