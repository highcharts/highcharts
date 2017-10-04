/* eslint-env node, es6 */
/* global console */
const glob = require('glob-fs')({ gitignore: true });

const files = glob.readdirSync('samples/unit-tests/**/**/demo.html');

files.forEach(file => {
    console.log(file); // eslint-disable-line no-console
});

