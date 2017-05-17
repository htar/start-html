var gulp = require('gulp'),
    sass = require('gulp-sass'), //scss
    nunjucksRender = require('gulp-nunjucks-render'), //do template
    plumber = require('gulp-plumber'), //show error on console
    path = require('path'),
    browserSync = require('browser-sync').create(), //browserSync
    htmlbeautify = require('gulp-html-beautify'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'), //minify-js
    pump = require('pump'),
    concat = require('gulp-concat'), //img
    cache = require('gulp-cache'), //img
    pngquant = require('imagemin-pngquant'), //img
    imagemin = require('gulp-imagemin'), //minify image
    stylish = require('jshint-stylish'), //js hint
    rename = require("gulp-rename"),
    fs = require('fs'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    combineMq = require('gulp-combine-mq'), //merge all @media
    sourcemaps = require('gulp-sourcemaps'); // shows in the browser links to styles line in scss


var sources = {
    src: "./src/",
    dist: "./dist/"
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
//function  that we add data to all page
function loadData(data_file) {
    var content = fs.readFileSync(data_file);
    return JSON.parse(content)
}

// js
gulp.task('js', function() {
    return gulp.src(`${sources.src}js/index.js`)
        .pipe(gulp.dest(`${sources.dist}assets/js`))
        .pipe(browserSync.stream()); //inject js
});

//sass
gulp.task('sass', function() {
    return gulp.src(`${sources.src}sass/style.scss`)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 15 versions'],
            cascade: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${sources.dist}assets/css`))
        .pipe(browserSync.stream()); //inject css
});

//nunjucks template + htmlbeautify
gulp.task('nunjucks', function() {
    return gulp.src(`${sources.src}pages/**/*.html`)
        .pipe(plumber())
        .pipe(nunjucksRender({
            data: loadData(`${sources.src}templates/data/template_data.json`),
            path: [`${sources.src}templates/`]
        }))
        .on('error', function(err) {
            console.log(err);
        })
        .pipe(htmlbeautify({
            indentSize: 2
        })) //html beautify
        .pipe(gulp.dest(`${sources.dist}`))
        .on('end', browserSync.reload);
});


//watcher
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch(`${sources.src}sass/*.scss`, ['sass']);
    gulp.watch(`${sources.src}image/**/*`, ['img']);
    gulp.watch(`${sources.src}fonts/**/*`, ['fonts']);
    gulp.watch([`${sources.src}pages/**/*.html`, `${sources.src}templates/**/*.html`], ['nunjucks']);
    gulp.watch([`${sources.src}js/*.js`], ['js']);
});


////////////////////////////////////////////////////////////////////////////////////////////////////////


// minify js
gulp.task('min-js', function() {
    return gulp.src([
            `${sources.src}js/index.js`
        ])
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(`${sources.dist}assets/js/`));
});

//minify css
gulp.task('min-css', function() {

    return gulp.src(`${sources.src}sass/style.scss`)
        .pipe(plumber())

    .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 15 versions'],
            cascade: true
        }))
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS({
            compatibility: 'ie9'
        }))
        .pipe(gulp.dest(`${sources.dist}assets/css`));
});

//minify image
gulp.task('image-min', function() {
    return gulp.src(`${sources.src}image/**/*`)
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 2,
            // svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(`${sources.dist}assets/img`));
});


// build minify librarys file
gulp.task('libs-js', function() {
    return gulp.src([
            `${sources.src}libs/**/jquery.min.js`,
            `${sources.src}libs/**/*.js`
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(`${sources.dist}assets/js`));
});

gulp.task('libs-css', function() {
    return gulp.src([
            `${sources.src}libs/**/bootstrap.min.css`,
            `${sources.src}libs/**/*.css`
        ])
        .pipe(concat('libs.min.css'))
        .pipe(gulp.dest(`${sources.dist}assets/css`));
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
// build project
gulp.task('fonts', function() {
    var buildFonts = gulp.src(`${sources.src}fonts/**/*`).pipe(gulp.dest(`${sources.dist}assets/fonts`));
});


gulp.task('img', function() {
    var buildImg = gulp.src(`${sources.src}image/**/*`).pipe(gulp.dest(`${sources.dist}assets/img`));
});

gulp.task('build', ['nunjucks', 'img', 'fonts', 'sass'], function() {
    var buildCssLibs = gulp.src(`${sources.src}libs/**/*.css`).pipe(gulp.dest(`${sources.dist}assets/css`));
    var buildJsLibs = gulp.src(`${sources.src}libs/**/*.js`).pipe(gulp.dest(`${sources.dist}assets/js`));

    var buildJs = gulp.src(`${sources.src}js/**/*.js`).pipe(gulp.dest(`${sources.dist}assets/js`));
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
// clear dist folder
gulp.task('clean', function() {
    return del.sync(`${sources.dist}*`);
});

gulp.task('production', ['nunjucks', 'image-min', 'fonts', 'min-js', 'min-css', 'libs-js', 'libs-css']);

gulp.task('default', ['build', 'watch']);
