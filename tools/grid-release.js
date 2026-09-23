/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-console: 0 */
const { main, runRelease } = require('./libs/product-release');

if (require.main === module) {
    main(process.argv.slice(2)).catch(error => {
        console.error(error.message);
        process.exitCode = 1;
    });
}

module.exports = { main, runRelease };
