/* eslint-env node, es6 */
/* eslint func-style: ["error", "expression"] */
'use strict';
const fs = require('fs');

const getFunction = (body, args) => {
    let a = [null].concat((args || []), [body]); // context + arguments + function body
    let f;
    try {
        f = new (Function.prototype.bind.apply(Function, a)); // eslint-disable-line no-new-func
    } catch (e) {
        fs.writeFileSync('temp.js', body, 'utf8');
        /* eslint-disable no-console */
        console.log(['Construction of function failed. Caused by: ' + e.message,
            'View function body in temp.js'
        ].join('\n'));
        /* eslint-enable no-console */
        throw 'Exit';
    }
    return f;
};

const preProcess = (content, build) => {
    let tpl = content
        .replace(/\r\n/g, '\n') // Windows newlines
        .replace(/"/g, '___doublequote___') // Escape double quotes and backslashes, to be reinserted after parsing
        .replace('/[ ,]/', '___rep3___') // Conflicts with trailing comma removal below
        .replace('/[ ,]+/', '___rep4___') // Conflicts with trailing comma removal below
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n') // Prepare newlines
        .replace(/^/, 'var s = "') // Start supercode output, start first output string
        .replace(/\/\*=\s?/g, '";\n') // Start supercode block, closes output string
        .replace(/=\*\//g, '\ns += "')  // End of supercode block, starts output string
        .replace(/$/, '";\nreturn s;'); // End supercode output, end last output string

    // The evaluation function for the ready built supercode
    let supercode = getFunction(tpl, ['build']);

    // Collect trailing commas left when the template engine has removed
    // object literal properties or array items
    tpl = supercode(build)
        .replace(/,(\s*(\]|\}))/g, '$1')
        .replace(/___doublequote___/g, '"')
        .replace(/___rep3___/g, '/[ ,]/')
        .replace(/___rep4___/g, '/[ ,]+/');

    return tpl;
};

module.exports = {
    getFunction: getFunction,
    preProcess: preProcess
};
