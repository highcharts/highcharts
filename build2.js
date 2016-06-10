'use strict';
const fs = require('fs'),
	argv = require('yargs').argv,
	LE = '\n';

// @todo Have a register for module return names to apply as arguments

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

const applyUMD = content => {
	let name = 'Highcharts';
	return ['(function (root, factory) {',
		'if (typeof module === \'object\' && module.exports) {',
		'module.exports = root.document ?',
		'factory(root) : ',
		'factory;',
		'} else {',
		'root.' + name + ' = factory(root);',
		'}',
		'}(typeof window !== \'undefined\' ? window : this, function (win) {',
		content,
		'}));'
	].join(LE);
};

const applyModule = content => '(function () {' + LE + content + LE + '}());';

const transform = (content, i, arr) => {
	let exportExp = /\n?\s*export default ([^;\n]+)[\n;]+/,
		r = getMatch(content, exportExp);
	// Remove import statements
	// @todo Add imported variables to the function arguments. Reuse getImports for this
	content = content.replace(/import\s[^\n]+\n/g, '')
		.replace(exportExp, ''); // Remove exports statements
	
	if (i === arr.length - 1) {
		// @notice Do not remove line below. It is for when we have more advanced master files.
		// content = (r ? 'return = ' : '') + '(function () {' + LE + content + (r ? LE + 'return ' + r + ';': '') + LE + '}());';
		content = (r ? 'return ' + r : '');
	} else {
		content = (r ? 'var ' + r + ' = ' : '') + '(function () {' + LE + content + (r ? LE + 'return ' + r + ';': '') + LE + '}());';
	}
	return content;
};

const compileFile = (o) => {
	let modules = getDependencies(o.entry, '', [])
		.reverse()
		.map(getContents)
		.map(transform)
		.join(LE);
	let result = o.umd ? applyUMD(modules) : applyModule(modules);
	if (o.pretty) {
		const beautify = require('js-beautify').js_beautify;
		result = beautify(result);
	}
	return result;
};

let result = compileFile({
	entry: 'js/masters/highcharts.js',
	pretty: true,
	umd: true
});
fs.writeFileSync('code/highcharts.src.js', result, 'utf8');