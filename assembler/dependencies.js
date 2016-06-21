'use strict';
const fs = require('fs'),
	LE = '\n';
let exportExp = /\n?\s*export default ([^;\n]+)[\n;]+/;

const getMatch = (str, regex) => {
	let m = str.match(regex);
	return m && m[1];
};

const getFileImports = content => {
	const importExp = /import\s[^;\n]+[\n;]+/g;
	return (content.match(importExp) || []).map((line, i) => {
		let path = getMatch(line, /['"]([^']+)['"]/),
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

const getOrderedDependencies = (file, parent, dependencies) => {
	let	filePath = cleanPath(folder(parent) + file),
		content = fs.readFileSync(filePath, 'utf8'),
		imports = getFileImports(content);
	if (parent === '') {
		dependencies.unshift(filePath);
	} else {
		dependencies.splice(dependencies.indexOf(parent) + 1, 0, filePath);
	}
	imports.forEach(d => {
		let module = d[0],
			modulePath = cleanPath(folder(filePath) + module);
		if (dependencies.indexOf(modulePath) === -1) {
			dependencies = getOrderedDependencies(module, filePath, dependencies);
		}
	});
	return dependencies;
};

// @todo add "caching" of file content
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

const applyModule = content => {
	return ['(function (factory) {',
		'if (typeof module === \'object\' && module.exports) {',
		'module.exports = factory;',
		'} else {',
		'factory(Highcharts);',
		'}',
		'}(function (Highcharts) {',
		content,
		'}));'
	].join(LE);
};

/**
 * List of names for the exported variable per module.
 * @param  {[string]} dependencies Dependencies array. List of paths, ordered.
 * @return {[string, string|null]}  Path of module and name of its exported variable.
 */
const getExports = dependencies => {
	return dependencies.map(d => {
		let content = getContents(d),
			exported = getMatch(content, exportExp);
		return [d, exported];
	});
};

/**
 * Get tuples of all the imported variables for each module.
 * @param  {[string]} dependencies Dependecies array. List of paths to modules, ordered.
 * @param  {[string]} exported     List of names for variables exported by a module.
 * @return {[string, [string, string]]} List of all the module parameters and its inserted parameters
 */
const getImports = (dependencies, exported) => {
	return dependencies.map(d => {
		let content = getContents(d),
			imports = getFileImports(content);
		return imports.reduce((arr, t) => {
			let path,
				mParam,
				param = t[1];
			if (param) {
				// @todo check if import is of object structure and not just default
				path = cleanPath(folder(d) + t[0]);
				mParam = exported.find(e => e[0] === path)[1];
				arr[1].push([param, mParam]);
			}
			return arr;
		}, [d, []]);
	});
}

/**
 * Transform a module into desired structure
 * @param  {string} path     Path to the module file
 * @param  {string} content  Content of the module
 * @param  {[string, string]} imported Parameters which the module imports
 * @param  {string} r  	 The name of the default variable exported by the module
 * @param  {number} i        Index in dependencies array.
 * @param  {[string]} arr      Dependencies array
 * @return {string}       	The module content after transformation
 */
const moduleTransform = (path, content, imported, r, i, arr) => {
	let params = imported.map(m => m[0]).join(', ');
	let mParams = imported.map(m => m[1]).join(', ');
	// Remove import statements
	// @todo Add imported variables to the function arguments. Reuse getImports for this
	content = content.replace(/import\s[^\n]+\n/g, '')
		.replace(exportExp, ''); // Remove exports statements
	if (i === arr.length - 1) {
		// @notice Do not remove line below. It is for when we have more advanced master files.
		// content = (r ? 'return = ' : '') + '(function () {' + LE + content + (r ? LE + 'return ' + r + ';': '') + LE + '}());';
		content = (r ? 'return ' + r : '');
	} else {
		// @notice The result variable gets the same name as the one returned by the module, but when we have more advanced modules it could probably benefit from using the filename instead.
		content = (r ? 'var ' + r + ' = ' : '') + '(function (' + params + ') {' + LE + content + (r ? LE + 'return ' + r + ';': '') + LE + '}(' + mParams + '));';
	}
	return content;
};

/**
 * Apply transformation to the compiled file content.
 * @param  {string} content Content of file
 * @param  {object} options fileOptions
 * @return {string}         Content of file after transformation
 */
const fileTransform = (content, options) => {
	let pretty = options.pretty;
	let umd = options.umd;
	let result = umd ? applyUMD(content) : applyModule(content);
	if (pretty) {
		const beautify = require('js-beautify').js_beautify;
		result = beautify(result);
	}
	return result;
};

const compileFile = options => {
	let entry = options.entry;
	let umd = options.umd;
	let dependencies = getOrderedDependencies(entry, '', []);
	let exported = getExports(dependencies);
	let imported = getImports(dependencies, exported);
	let mapTransform = (path, i, arr) => {
		let content = getContents(path);
		let ex = exported.find(val => val[0] === path)[1];
		let im = imported.find(val => val[0] === path)[1];
		return moduleTransform(path, content, im, ex, i, arr);
	}
	let modules = dependencies
		.reverse()
		.map(mapTransform)
		.join(LE);
	return fileTransform(modules, options)
};

module.exports = {
	getMatch: getMatch,
	compileFile: compileFile
};