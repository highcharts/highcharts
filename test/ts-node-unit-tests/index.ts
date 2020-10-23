// Can also use gulp for this
require('./prepare-data')

// ToDo: walk the test folder and run everything in it
const tests = require('./tests/series');
try {
    Object.values(tests).forEach(test => {
        if (typeof test === 'function'){
            test();
        }
    });
} catch (error) {
    console.error(error);
}