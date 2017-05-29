/* eslint-env node, es6 */
/* eslint no-console:0, valid-jsdoc:0 */
/* eslint-disable func-style */

const fs = require('fs');
const glob = require('glob');

const getTests = (callback) => {
	glob(__dirname + '/../../samples/*/*/*/', null, callback);
};



getTests((err, files) => {
	console.log(files);
});
