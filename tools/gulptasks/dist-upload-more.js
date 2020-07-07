const { series, task } = require('gulp');
/**
 * Task that uploads release assets that are not code or API docs
 */
task('dist-upload-more', series('dist-upload-errors', 'dist-upload-samples-data', 'dist-upload-studies'));
