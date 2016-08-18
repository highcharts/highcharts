/* eslint-env node, es6 */
/* eslint func-style: ["error", "expression"] */
'use strict';
const debug = (d, text) => {
    if (d) {
        /* eslint-disable no-console */
        console.log(text);
        /* eslint-enable no-console */
    }
};

module.exports = {
    debug: debug
};
