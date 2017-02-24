var gulp = require('gulp'),
    sass = require('gulp-sass'), //scss
    nunjucksRender = require('gulp-nunjucks-render'), //do template
    plumber = require('gulp-plumber'), //show error on console
    path = require('path');
    browserSync = require('browser-sync').create(), //browserSync
    htmlbeautify = require('gulp-html-beautify'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'), //minify-js
    pump = require('pump'),
    imagemin = require('gulp-imagemin'), //minify image
    // jshint = require('gulp-jshint'),//js hint
    stylish = require('jshint-stylish'), //js hint
    rename = require("gulp-rename"),
    fs = require('fs'),
    autoprefixer = require('gulp-autoprefixer'),
    combineMq = require('gulp-combine-mq'), //merge all @media
    sourcemaps = require('gulp-sourcemaps'); // shows in the browser links to styles line in scss

// js Hint
//minify image
//minify js
//minify css
//browserSync
//sass
//nunjucks template + htmlbeautify
//watcher

// js Hint
// gulp.task('jshint', function(){
//     gulp.src('dist/js/index.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('jshint-stylish')); // other argument 'default'
// })

// minify image
gulp.task('minify-image', function() {
    return gulp.src('src/lib/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});



// minify js
gulp.task('minify-js', function(cb) {
    pump([
            gulp.src('src/lib/*.js'),
            uglify(),
            rename({
                suffix: '.min'
            }), //add .min suffix
            gulp.dest('dist/js')
        ],
        cb
    );
});

// minify css
gulp.task('minify-css', function() {
    return gulp.src(['src/lib/*.css', '!src/lib/*.min.css'])
        .pipe(plumber())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: '.min'
        })) //add .min suffix
        .pipe(gulp.dest('dist/css'));
});

//browserSync
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        ui: {
            port: 8010
        }
    });
});


//sass
gulp.task('sass', function() {
    return gulp.src('./src/sass/style.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 15 versions'],
            cascade: true
        }))
        // .pipe(combineMq({
        //   beautify: true
        // }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/lib/'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream()); //inject css
});


//function  that we add data   on start new page 
function loadData(data_file) {
    var content = fs.readFileSync(data_file);
    return JSON.parse(content)
}

//nunjucks template + htmlbeautify
gulp.task('nunjucks', function() {
    return gulp.src('src/pages/**/*.html')
        .pipe(plumber())
        .pipe(nunjucksRender({
             data: loadData('src/templates/data/template_data.json'),
            path: ['src/templates/']
        }))
        .on('error', function(err) {
            console.log(err);
        })
        .pipe(htmlbeautify({
            indentSize: 2
        })) //html beautify
        .pipe(gulp.dest('dist'));
});


//watcher
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch(['src/pages/**/*.html', 'src/templates/**/*.html'], ['nunjucks']);
    gulp.watch(['dist/js/*.js']).on('change', browserSync.reload);
    gulp.watch(['dist/*.html']).on('change', browserSync.reload);
});


gulp.task('default', ['watch']);