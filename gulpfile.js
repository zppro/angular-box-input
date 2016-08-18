"user strict";
    gulp        = require('gulp'),
    $plugins    = require('gulp-load-plugins')(),
    gulpsync    = $plugins.sync(gulp)
    ;

// Error handler
function handleError(err) {
    log(err.toString());
    this.emit('end');
}

// log to console using
function log(msg) {
    $plugins.util.log( $plugins.util.colors.blue( msg ) );
}


var src_root = './src/';
var pub_root = './pub-dev/';

var paths = {
    watch_jade :src_root + 'jade/**/*.jade',
    watch_less: src_root + 'less/**/*.less',
    watch_js :[src_root +'lib/**/*.js',src_root +'js/**/*.js'],
    src_jade_index:src_root+'jade/index.jade',
    src_jade: [src_root + 'jade/**/*.jade', '!' + src_root + 'jade/layout.jade', '!' + src_root + 'jade/index.jade'],
    src_less: src_root + 'less/*.less',
    src_js: [src_root + 'lib/**/*.js', src_root + 'js/**/*.js'],
    pub_jade: pub_root + 'views/',
    pub_less: pub_root + 'css/',
    pub_js: pub_root + 'js/'
};

//---------------
// WATCH
//---------------

gulp.task('watch', function() {
    log('Starting watch and LiveReload..');
    $plugins.livereload.listen();
    gulp.watch(paths.watch_jade, ['jade-index','jade']);
    gulp.watch(paths.watch_less, ['less']);
    gulp.watch(paths.watch_js,['js']);
});

// JADE
gulp.task('jade-index', function() {
    log('Building jade index.. ');
    return gulp.src(paths.src_jade_index)
        .pipe($plugins.jade({pretty: true}))
        .on('error', handleError)
        .pipe(gulp.dest(pub_root))
        .pipe($plugins.livereload())
        ;
});

gulp.task('jade', function() {
    log('Building jade.. ');
    return gulp.src(paths.src_jade)
        .pipe($plugins.jade({pretty: true}))
        .on('error', handleError)
        .pipe(gulp.dest(paths.pub_jade))
        .pipe($plugins.livereload())
        ;
});

// LESS
gulp.task('less',function() {
    log('Building less..');
    return gulp.src(paths.src_less)
        .pipe($plugins.less())
        .on('error', handleError)
        .pipe(gulp.dest(paths.pub_less))
        .pipe($plugins.livereload())
        ;
});

// JS
gulp.task('js', function() {
    log('Building js..');
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(paths.src_js)
        .pipe($plugins.jsvalidate())
        .on('error', handleError)
        .pipe($plugins.concat('app.js'))
        .pipe($plugins.ngAnnotate())
        .on('error', handleError)
        .pipe(gulp.dest(paths.pub_js))
        .pipe($plugins.livereload())
        ;
});

gulp.task('dev', gulpsync.sync([
    'jade-index',
    'jade',
    'less',
    'js',
    'watch'
]), function(){
    log('Starting dev...');
    log('************');
    //log('* All Done * You can start editing your code, LiveReload will update your browser after any change..');
    log('  dev执行成功..');
    log('************');

});

gulp.task('default',['dev']);