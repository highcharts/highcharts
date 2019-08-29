/* eslint func-style: 0 */
const gulp = require('gulp');
/**
 * Creates a set of ES6-modules which is distributable.
 * @return {undefined}
 */
const buildESModules = () => {
    const {
        buildModules
    } = require('highcharts-assembler/src/build.js');
    buildModules({
        base: './js/',
        output: './code/',
        type: 'classic'
    });
};
gulp.task('build-modules', buildESModules);
