const gulp = require('gulp');

const { resetProductsConfig } = require('./lib/test.js');

gulp.task('test-after', async () => {
    resetProductsConfig();
});
