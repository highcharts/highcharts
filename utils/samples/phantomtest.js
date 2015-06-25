/**
Experimental PhantomJS runner for the sample suite.

phantomjs phantomtest.js

Status
- Currently only runs through highcharts/demo
- Fails on security error on canvas getImageData method, so it is pretty much useless until this is resolved.
*/



var page = require('webpage').create(),
	fs = require('fs'),
	path = 'highcharts/demo/',
	samples = fs.list('../../samples/' + path),
	i = 2;


function runRecursive() {
	var dir;

	dir = samples[i];

	if (dir !== '.' && dir !== '..') {
		page.open('http://utils.highcharts.local/samples/compare-view.php?path=' + path + dir, function (status) {
		  	console.log(path + dir, status);
		});
	}
}

page.onConsoleMessage = function (m) {
	if (m === '@proceed') {
		i = i + 1;
		if (samples[i]) {
		  	runRecursive();
		} else {
			phantom.exit();
		}
	}
};


runRecursive();

