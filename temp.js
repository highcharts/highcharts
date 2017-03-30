const glob = require('glob');
const fs = require('fs');

glob('samples/highcharts/*/*/demo.details', null, (er, files) => {

	files.slice(0, 10).forEach((file) => {
		
		let s = fs.readFileSync(file, 'utf-8');
		s.split('\n').forEach((line) => {
			if (/^ name:/.test(line)) {
				name = line.split('name:')[1].trim();
				console.log(name);
			}
		});
	});
});