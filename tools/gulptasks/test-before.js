const gulp = require('gulp');

const { setProductsConfig } = require('./lib/test.js');

gulp.task('test-before', async () => {
    setProductsConfig();
});
