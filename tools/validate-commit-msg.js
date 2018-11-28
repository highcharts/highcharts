// Validates the commit message.
// Used by the commit-msg hook

/* eslint-env node, es6 */
/* eslint-disable func-style */
/* eslint-disable no-console */
/* eslint-disable no-process-exit */

'use strict';

// Add validation functions here.
const validators = [
    (msg) => msg.indexOf('Fixes') >= 0 ? 'Use past tense (Fixed, not Fixes)' : 0,
    (msg) => msg[0].toUpperCase() !== msg[0] ? 'First letter should be caps' : 0
];

const args = process.argv;
const fs = require('fs');

require('colors');

if (args.length < 3) {
    // This is not ran correctly
    console.log('Expected commit message link, unable to validate');
    process.exit(1);
}

// Get the commit message
fs.readFile(args[2], 'utf8', (err, commitMessage) => {
    if (err) {
        return console.log(err.red) && process.exit(1);
    }

    // Do validation of commitMessage
    let errors = [];

    validators.forEach((fn) => {
        let res = fn(commitMessage);
        if (res !== 0) {
            errors.push(res);
        }
    });

    if (errors.length) {
        console.log('Commit message does not follow spec:');
        errors.forEach((msg) => console.log('  ' + msg.red));
        return process.exit(1);
    }

    console.log('Commit message is OK, proceeding.'.green);

    // All is a-ok
    return process.exit(0);
});

