const gulp = require('gulp');
/**
 * Run the nightly. The task spawns a child process running node.
 */
gulp.task('nightly', function () {
    const spawn = require('child_process').spawn;
    spawn('node', ['nightly.js'].concat(process.argv.slice(3)), {
        cwd: 'utils/samples',
        stdio: 'inherit'
    });
});
