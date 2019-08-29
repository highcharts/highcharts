const Gulp = require('gulp');

/**
 * Usage: npx gulp compare-filesizes --old old.json --new new.json
 *
 * Options:
 *   --old      Specify path to the "oldest" filesizes to compare. Required.
 *   --new      Specify path to the "newest" filesizes to compare. Required.
 *   --out      Specify where to store the resulting information. If not
 *              specifyed then the information will be outputted to the console.
 */
Gulp.task('compare-filesizes', () => {
    const {
        getCompareFileSizeTable
    } = require('../../compareFilesize.js');
    const {
        argv
    } = require('yargs');
    const out = argv.out;
    const pathOld = argv.old;
    const pathNew = argv.new;
    if (!pathOld || !pathNew) {
        throw new Error(
            'This task requires paths to the files --old and --new'
        );
    }
    return getCompareFileSizeTable(pathOld, pathNew, out);
});
