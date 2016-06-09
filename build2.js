'use strict';
let fs = require('fs'),
	argv = require('yargs').argv,
	entry = 'js/masters/highcharts.js',
	output = 'code/highcharts.js',
	pretty = true;
const LE = '\n';

// @todo Have a register for module return names to apply as arguments
// @todo Do not ignore the master file, but return its result directly to the UMD function

const getMatch = (str, regex) => {
	let m = str.match(regex);
	return m && m[1];
};

const getImports = content => {
	return (content.match(/import\s[^\n]+\n/g) || []).map((line, i) => {
		let path = getMatch(line, /\'([^']+)\'/),
			variable = getMatch(line, /import (.+) from/);
		return [path, variable]
	});
};

const cleanPath = path => {
	let p = path;
	while (p.indexOf('/./') > -1) {
		p = p.replace('/./', '/');
	}
	while (p.indexOf('/../') > -1) {
		p = p.replace(/\/([^\/]+\/..\/)/g, '/');
	}
	return p;
};

const folder = path => {
	let folderPath = '.'
	if (path !== '') {
		folderPath = path.substring(0, path.lastIndexOf("/"));
	}
	return folderPath + '/';
};

const getDependencies = (file, parent, dependencies) => {
	let	filePath = cleanPath(folder(parent) + file),
		content = fs.readFileSync(filePath, 'utf8'),
		imports = getImports(content);
	if (parent === '') {
		dependencies.unshift(filePath);
	} else {
		dependencies.splice(dependencies.indexOf(parent) + 1, 0, filePath);
	}
	imports.forEach(d => {
		let module = d[0],
			modulePath = cleanPath(folder(filePath) + module);
		if (dependencies.indexOf(modulePath) === -1) {
			dependencies = getDependencies(module, filePath, dependencies);
		}
	});
	return dependencies;
};

const getContents = path => fs.readFileSync(path, 'utf8');

const transform = content => {
	let exportExp = /\n\s*export default ([^;\n]+)[\n;]+/,
		r = getMatch(content, exportExp);
	// Remove import statements
	// @todo Add imported variables to the function arguments. Reuse getImports for this
	content = content.replace(/import\s[^\n]+\n/g, '')
		.replace(exportExp, ''); // Remove exports statements
	content = (r ? 'var ' + r + ' = ' : '') + '(function () {' + LE + content + (r ? LE + 'return ' + r + ';': '') + LE + '}());';
	return content;
};

let modules = getDependencies(entry, '', [])
	.reverse()
	.slice(0, -1) // Remove the last module. We're not interested in the master file.
	.map(getContents)
	.map(transform)
	.join(LE);
let result = '(function () {' + LE + modules + LE + '}());';
if (pretty) {
	const beautify = require('js-beautify').js_beautify;
	result = beautify(result);
}
fs.writeFileSync(output, result, 'utf8');
console.log('----------')
console.log('----------')

