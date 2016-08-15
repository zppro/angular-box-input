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
    src_jade: src_root + 'jade/**/*.jade',
    pub_jade: pub_root + 'views/'
};

//---------------
// WATCH
//---------------

gulp.task('watch', function() {
    log('Starting watch and LiveReload..');

    $plugins.livereload.listen();
    gulp.watch(paths.src_jade, ['jade']);

});

// JADE
gulp.task('jade', function() {
    log('Building jades.. ');

    return gulp.src(paths.src_jade)
        .pipe($plugins.jade({pretty: true}))
        .on('error', handleError)
        .pipe(gulp.dest(paths.pub_jade))
        .pipe($plugins.livereload())
        ;
});

gulp.task('dev', gulpsync.sync([
    'jade',
    'watch'
]), function(){
    log('Starting dev...');
    log('************');
    //log('* All Done * You can start editing your code, LiveReload will update your browser after any change..');
    log('  dev执行成功..');
    log('************');

});

gulp.task('default',['dev']);