'use strict';
const fs = require('fs'),
	argv = require('yargs').argv,
	LE = '\n';
let exportExp = /\n?\s*export default ([^;\n]+)[\n;]+/;

const getMatch = (str, regex) => {
	let m = str.match(regex);
	return m && m[1];
};

const getFileImports = content => {
	return (content.match(/import\s[^\n]+\n/g) || []).map((line, i) => {
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

const applyModule = content => '(function () {' + LE + content + LE + '}());';

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
const transform = (path, content, imported, r, i, arr) => {
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

const compileFile = (entry, umd, pretty) => {
	let dependencies = getOrderedDependencies(entry, '', []);
	let exported = getExports(dependencies);
	let imported = getImports(dependencies, exported);
	let mapTransform = (path, i, arr) => {
		let content = getContents(path);
		let ex = exported.find(val => val[0] === path)[1];
		let im = imported.find(val => val[0] === path)[1];
		return transform(path, content, im, ex, i, arr);
	}
	let modules = dependencies
		.reverse()
		.map(mapTransform)
		.join(LE);
	let result = umd ? applyUMD(modules) : applyModule(modules);
	if (pretty) {
		const beautify = require('js-beautify').js_beautify;
		result = beautify(result);
	}
	return result;
};
/**
 * END OF CONCATENATE SCRIPT
 */
/**
 * BEGINNING OF BUILD SCRIPT
 */

/**
 * [getFilesInFolder description]
 * @param  {[type]} base              [description]
 * @param  {[type]} includeSubfolders [description]
 * @param  {[type]} path              [description]
 * @return {[type]}                   [description]
 */
const getFilesInFolder = (base, includeSubfolders, path) => {
    const fs = require('fs');
    let filenames = [],
        filepath,
        isDirectory;
        path = (typeof path === 'undefined') ? '' : path;
        fs.readdirSync(base + path).forEach(function (filename) {
            filepath = base + path + filename;
            isDirectory = fs.lstatSync(filepath).isDirectory();
            if (isDirectory && includeSubfolders) {
                filenames = filenames.concat(getFilesInFolder(base, includeSubfolders, path + filename + '/'));
            } else if (!isDirectory) {
                filenames.push(path + filename);
            }
        });
    return filenames;
}

let defaultOptions = {
    base: undefined, // Path to where the build files are located
    excludes: {},
    files: undefined, // Array of files to compile
    output: './' // Folder to output compiled files
};

/**
 * [build description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
const build = userOptions=> {
    // userOptions is an empty object by default
    userOptions = (typeof userOptions === 'undefined') ? {} : userOptions;
    // Merge the userOptions with defaultOptions
    let options = Object.assign(defaultOptions, userOptions);
    // Check if required options are set
    if (options.base) {
        options.files = (options.files) ? options.files : getFilesInFolder(options.base, true);
        options.files.forEach(function (filename) {
        	let compiled = compileFile(options.base + filename, options.umd, options.pretty);
			fs.writeFileSync(options.output + filename, compiled, 'utf8');

        //     // compileFile(options.base, options.output, filename, options.excludes[filename], options.wrapper);
        //     compileFile(options.base , options.output, filename, options.excludes[filename], options.wrapper);
        });
    } else {
        outPutMessage('Missing required option!', 'The options \'base\' is required for the script to run');
    }
}

let files = (argv.file) ? [argv.file] : undefined,
    DS = '\\\\[^\\\\]', // Regex: Single directory seperator
    folders = {
        'parts': 'parts' + DS + '+\.js$',
        'parts-more': 'parts-more' + DS + '+\.js$'
    };
build({
    base: './js/masters/',
    excludes: {
        'modules/annotations.js': new RegExp(folders['parts']),
        'modules/boost.js': new RegExp(folders['parts']),
        'modules/broken-axis.js': new RegExp(folders['parts']),
        'modules/canvasrenderer.experimental.js': new RegExp(folders['parts']),
        'modules/canvgrenderer-extended.js': new RegExp(folders['parts']),
        'modules/data.js': new RegExp(folders['parts']),
        'modules/drilldown.js': new RegExp(folders['parts']),
        'modules/exporting-old-look.js': new RegExp(folders['parts']),
        'modules/exporting.js': new RegExp(folders['parts']),
        'modules/funnel.js': new RegExp(folders['parts']),
        'modules/heatmap.js': new RegExp(folders['parts']),
        'modules/map.js': new RegExp(folders['parts']),
        'modules/map-parser.js': new RegExp([folders['parts'], 'data\.src\.js$'].join('|')),
        'modules/no-data-to-display.js': new RegExp(folders['parts']),
        'modules/offline-exporting.js': new RegExp(folders['parts']),
        'modules/overlapping-datalabels.js': new RegExp(folders['parts']),
        'modules/series-label.js': new RegExp(folders['parts']),
        'modules/solid-gauge.js': new RegExp([folders['parts'], 'GaugeSeries\.js$'].join('|')),
        'modules/treemap.js': new RegExp(folders['parts']),
        'highcharts-more.js': new RegExp(folders['parts']),
        'highcharts-3d.js': new RegExp(folders['parts'])
    },
    files: files,
    output: './code/'
});
/**
 * END OF BUILD SCRIPT
 */