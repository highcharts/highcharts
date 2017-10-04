/* eslint-env node, es6 */
/* global console */

/*
To do
- replace highstock and highmaps with modules
- translate to local files where possible
- parse resources from demo.details?
 */

const fs = require('fs');
const glob = require('glob-fs')({ gitignore: true });

const files = glob.readdirSync('samples/unit-tests/**/**/demo.html');

let dependencies = [];

let i = 0;

files.forEach(file => {
    if (i < 50) {
        let html = fs.readFileSync(file, 'utf8');

        let regex = /src="(.*?)"/g;
        let match = regex.exec(html);
        while (match) {
            if (dependencies.indexOf(match[1]) === -1) {
                dependencies.push(match[1]);
            }
            match = regex.exec(html);
        }
    }

    i++;
});

console.log(dependencies); // eslint-disable-line no-console

