/* eslint-env node, es6 */
/* eslint func-style: ["error", "expression"] */
'use strict';
const fs = require('fs');
const LE = '\n';
let exportExp = /\n?\s*export default ([^;\n]+)[\n;]+/;
const licenseExp = /(\/\*\*[\s\S]+@license[\s\S]+?(?=\*\/)\*\/)/;

/**
 * Test if theres is a match between
 * @param  {RegExp} regex The regex to test for
 * @param  {string} str   The string to test against
 * @returns {bool}       Returns true if a match is found, false if no match or bad arguments provided.
 */
const regexTest = (regex, str) => (regex instanceof RegExp) && regex.test(str);

/**
 * Get the result from the first capture group of a regex execution.
 * @param  {RegExp} regex The regex to execute
 * @param  {string} str   The string to match against
 * @returns {string|null}       The result from the capture group or null
 */
const regexGetCapture = (regex, str) => regexTest(regex, str) ? regex.exec(str)[1] : null;

const getFileImports = content => {
    const importExp = /import\s[^;\n]+[\n;]+/g;
    return (content.match(importExp) || []).map((line) => {
        let path = regexGetCapture(/['"]([^']+)['"]/, line),
            variable = regexGetCapture(/import (.+) from/, line);
        return [path, variable];
    });
};

const cleanPath = path => {
    let p = path;
    while (p.indexOf('/./') > -1) {
        p = p.replace('/./', '/');
    }
    while (p.indexOf('/../') > -1) {
        p = p.replace(/\/([^\/]+\/\.\.\/)/g, '/');
    }
    return p;
};

const folder = path => {
    let folderPath = '.';
    if (path !== '') {
        folderPath = path.substring(0, path.lastIndexOf('/'));
    }
    return folderPath + '/';
};

// @todo add "caching" of file content
const getContents = path => fs.readFileSync(path, 'utf8');

const getOrderedDependencies = (file, parent, dependencies) => {
    let filePath = cleanPath(folder(parent) + file),
        content = getContents(filePath),
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

const applyUMD = content => {
    let name = 'Highcharts';
    return ['\'use strict\';',
        '(function (root, factory) {',
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
 * Adds a license header to the top of a distribution file.
 * License header is collected from the "masters" file.
 * @param  {string} content Content of distribution file.
 * @param  {object} o Object containing all build options.
 * @returns {string} Returns the distribution file with a header.
 */
const addLicenseHeader = (content, o) => {
    const str = getContents(o.entry);
    let header = regexGetCapture(licenseExp, str);
    return (header ? header: '') + content;
};

/**
 * Removes a license code block from a string.
 * @param  {string} content Module content.
 * @returns {string} Returns module content without license header.
 */
const removeLicenseHeader = content => content.replace(licenseExp, '');

/**
 * List of names for the exported variable per module.
 * @param  {[string]} dependencies Dependencies array. List of paths, ordered.
 * @returns {[?string]}  Path of module and name of its exported variable.
 */
const getExports = dependencies => {
    return dependencies.map(d => {
        let content = getContents(d),
            exported = regexGetCapture(exportExp, content);
        return [d, exported];
    });
};

/**
 * Get tuples of all the imported variables for each module.
 * @param  {[string]} dependencies Dependecies array. List of paths to modules, ordered.
 * @param  {[string]} exported     List of names for variables exported by a module.
 * @returns {[string, [string, string]]} List of all the module parameters and its inserted parameters
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
};

/**
 * Transform a module into desired structure
 * @param  {string} content  Content of the module
 * @param  {object} options Options object
 * @param  {string} options.path     Path to the module file
 * @param  {[string, string]} options.imported Parameters which the module imports
 * @param  {string} options.exported    The name of the default variable exported by the module
 * @param  {number} options.i        Index in dependencies array.
 * @param  {[string]} options.arr      Dependencies array
 * @returns {string} The module content after transformation
 */
const moduleTransform = (content, options) => {
    let path = options.path;
    let imported = options.imported;
    let r = options.exported;
    let i = options.i;
    let arr = options.arr;
    let exclude = options.exclude;
    let params = imported.map(m => m[0]).join(', ');
    let mParams = imported.map(m => m[1]).join(', ');
    // Remove license headers from modules
    content = removeLicenseHeader(content);
    // Remove use strict from modules
    content = content.replace(/\'use strict\';\r\n/, '');
    // Remove import statements
    // @todo Add imported variables to the function arguments. Reuse getImports for this
    content = content.replace(/import\s[^\n]+\n/g, '')
        .replace(exportExp, ''); // Remove exports statements
    if (regexTest(exclude, path)) {
        content = '';
    } else if (i === arr.length - 1) {
        // @notice Do not remove line below. It is for when we have more advanced master files.
        // content = (r ? 'return = ' : '') + '(function () {' + LE + content + (r ? LE + 'return ' + r + ';': '') + LE + '}());';
        content = (r ? 'return ' + r : '');
    } else {
        // @notice The result variable gets the same name as the one returned by the module, but when we have more advanced modules it could probably benefit from using the filename instead.
        content = (r ? 'var ' + r + ' = ' : '') + '(function (' + params + ') {' + LE + content + (r ? LE + 'return ' + r + ';' : '') + LE + '}(' + mParams + '));';
    }
    return content;
};

/**
 * Apply transformation to the compiled file content.
 * @param  {string} content Content of file
 * @param  {object} options fileOptions
 * @returns {string}         Content of file after transformation
 */
const fileTransform = (content, options) => {
    let umd = options.umd;
    let result = umd ? applyUMD(content) : applyModule(content);
    result = addLicenseHeader(result, options);
    result = result.replace(/@product.name@/g, options.product)
        .replace(/@product.version@/g, options.version)
        .replace(/@product.date@/g, options.date);
    return result;
};

const compileFile = options => {
    let entry = options.entry;
    let dependencies = getOrderedDependencies(entry, '', []);
    let exported = getExports(dependencies);
    let imported = getImports(dependencies, exported);
    let mapTransform = (path, i, arr) => {
        let content = getContents(path);
        let moduleOptions = Object.assign({}, options, {
            path: path,
            imported: imported.find(val => val[0] === path)[1],
            exported: exported.find(val => val[0] === path)[1],
            i: i,
            arr: arr
        });
        return moduleTransform(content, moduleOptions);
    };
    let modules = dependencies
        .reverse()
        .map(mapTransform)
        .filter(m => m !== '')
        .join(LE);
    return fileTransform(modules, options);
};

module.exports = {
    cleanPath,
    regexGetCapture: regexGetCapture,
    compileFile: compileFile
};
