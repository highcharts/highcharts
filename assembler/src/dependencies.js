/* eslint-env node, es6 */
/* eslint func-style: ["error", "expression"] */
'use strict';
const {
    exists,
    isArray,
    isString,
    getFile
} = require('./utilities.js');
const LE = '\n';
const IND = '    '; // 4 spaces
const {
    dirname,
    join,
    relative,
    resolve
} = require('path');
const { readFileSync } = require('fs');
const templateUMDStandalone = readFileSync(
    join(__dirname, 'templates/umd-standalone.txt'),
    'utf8'
);
const templateUMDModule = readFileSync(
    join(__dirname, 'templates/umd-module.txt'),
    'utf8'
);
const templateWrapModule = readFileSync(
    join(__dirname, 'templates/wrap-module.txt'),
    'utf8'
);

// eslint-disable-next-line valid-jsdoc
/**
 * Avoid accidentally replacing special replacement patterns
 */
const safeReplace = x => () => x;

/**
 * Test if theres is a match between
 * @param  {RegExp} regex The regex to test for
 * @param  {string} str   The string to test against
 * @return {bool}       Returns true if a match is found, false if no match or bad arguments provided.
 */
const regexTest = (regex, str) => (regex instanceof RegExp) && regex.test(str);

/**
 * Get the result from the first capture group of a regex execution.
 * @param  {RegExp} regex The regex to execute
 * @param  {string} str   The string to match against
 * @return {string|null}       The result from the capture group or null
 */
const regexGetCapture = (regex, str) => (regexTest(regex, str) ? regex.exec(str)[1] : null);

const isImportStatement = string => (
    isString(string) && /^import.*'.*'/.test(string)
);

const getLicenseBlock = txt => {
    let result = '';
    const searchMiddle = '@license';
    const searchStart = '/**';
    const searchEnd = '*/';
    if (isString(txt)) {
        const searchMiddleIndex = txt.indexOf(searchMiddle);
        if (searchMiddleIndex > -1) {
            const start = txt.slice(0, searchMiddleIndex);
            const end = txt.slice(searchMiddleIndex);
            const startIndex = start.lastIndexOf(searchStart);
            const endIndex = end.indexOf(searchEnd);
            if (startIndex > -1 && endIndex > -1) {
                result = txt.slice(
                    startIndex,
                    searchMiddleIndex + endIndex + searchEnd.length
                );
            }
        }
    }
    return result;
};

/**
 * Checks wether a given position in a string is inside a single line comment.
 * @param {String} str The string to check within
 * @param {Number} pos The position to check if is inside comment
 * @return {Boolean} Returns true if inside a comment
 */
const isInsideSingleComment = (str, pos) => {
    const indexComment = str.lastIndexOf('//', pos);
    const indexNewLine = str.lastIndexOf('\n', pos);
    return (
    // There is a comment in before index
        indexComment > -1 &&
    // There is not a newline before the comment
    indexNewLine < indexComment
    );
};

/**
 * Checks wether a given position in a string is inside a block comment.
 * @param {String} str The string to check within
 * @param {Number} pos The position to check if is inside comment
 * @return {Boolean} Returns true if inside a comment
 */
const isInsideBlockComment = (str, pos) => {
    const start = '/*'; // Start of block comment
    const end = '*/'; // End of block comment
    let indexStart = pos;
    let indexEnd = -1;
    let doSearch = true;
    while (doSearch) {
        indexStart = str.lastIndexOf(start, indexStart);
        doSearch = indexStart > -1 && isInsideSingleComment(str, indexStart);
        if (doSearch) {
            // Search before the last entry found
            indexStart -= 1;
        }
    }
    if (indexStart > -1) {
        doSearch = true;
        indexEnd = indexStart + start.length;
        while (doSearch) {
            indexEnd = str.indexOf(end, indexEnd);
            doSearch = indexEnd > -1 && isInsideSingleComment(str, indexEnd);
        }
    }
    return indexStart > -1 && (indexEnd === -1 || pos < (indexEnd + end.length));
};

/**
 * Returns a tuple with module name and export name from an import statement.
 * @param {String} str The import statement
 * @return {Array} Returns a tuple ['module-name', 'export-name']
 */
const getImportInfo = str => {
    const char = str.includes('\'') ? '\'' : '"';
    const start = str.indexOf(char);
    const end = str.lastIndexOf(char);
    const moduleName = str.substring(start + 1, end);
    const indexFrom = str.indexOf('from ' + char);
    const exportName = (
        (indexFrom > -1) ?
            str.substring('import '.length, indexFrom - 1) :
            null
    );
    return [moduleName, exportName];
};

/**
 * Searches for a substr in a string and returns an array of all the matches.
 *
 * @param {string} content The string to search in.
 * @param {string} str The start of the string to capture
 * @param {string} strEnd The end of the string to capture
 * @param {function} [isValid] Function to validate the capture. Defaults to a
 * function that always returns true.
 * @return {array} Returns an array of the the matches that is valid.
 */
const searchCapture = (content, str, strEnd, isValid = () => true) => {
    let index = 0;
    const captures = [];
    const ends = isArray(strEnd) ? strEnd : [strEnd];
    while (content.includes(str, index)) {
        index = content.indexOf(str, index);
        if (isValid(content, index)) {
            const indexLastChar = ends
            // eslint-disable-next-line no-loop-func
                .map(char => content.indexOf(char, index + str.length))
                .reduce(
                    (min, num) => (num > -1 ? Math.min(min, num) : min),
                    Number.MAX_SAFE_INTEGER
                );
            const capture = content.substring(index, indexLastChar + 1);
            captures.push(capture);
        }
        index += str.length;
    }
    return captures;
};

/**
 * Returns a list of tuples ['module-name', 'export-name'] from import
 * statements.
 * @param {String} content The string to look in for the statements.
 * @return {Array} List of tuples ['module-name', 'export-name'].
 */
const getFileImports = content => (!isString(content) ?
    [] :
    searchCapture(content, 'import ', '\n', (contnt, index) => (
        !isInsideSingleComment(contnt, index) &&
    !isInsideBlockComment(contnt, index)
    // TODO isInsideString
    )).map(getImportInfo));

/**
 * Find and returns the requires tags in a file.
 * Read more about the requires tag at http://usejsdoc.org/tags-requires.html
 *
 * @param {string} content Contents of the file.
 * @return {array} Returns a list of names for the required modules.
 */
const getRequires = content => {
    let requires = [];
    if (content) {
        const strStart = '@requires ';
        const strEnd = '\n';
        requires = searchCapture(content, strStart, strEnd, isInsideBlockComment)
            .map(str => str
                .replace(strStart, '')
                .replace(strEnd, ''));
    }
    return requires;
};

/**
 * Find and returns the first module tag in a file, or undefined if no module
 * tag was provided.
 * Read more about the module tag at http://usejsdoc.org/tags-module.html
 *
 * @param {string} content Contents of the file.
 * @return {string|undefined} Returns the first module tag that is found,
 * undefined if none are found.
 */
const getModuleName = content => {
    const strStart = '@module ';
    const strEnd = ['\n', ' ']; // Ends at either a line break or a space
    const moduleTags =
    searchCapture(content, strStart, strEnd, isInsideBlockComment)
        .map(string => strEnd.reduce(
            (str, chars) => str.replace(chars, ''),
            string.replace(strStart, '')
        ));

    // Return the first module name found, or undefined.
    // eslint-disable-next-line no-undefined
    return moduleTags.length ? moduleTags[0] : undefined;
};


const getOrderedDependencies = (file, parent, dependencies) => {
    const filePath = isString(parent) ? join(dirname(parent), file) : file;
    const content = getFile(filePath);
    const dep = isArray(dependencies) ? dependencies : [];
    if (content === null) {
        throw new Error([
            `File ${filePath} does not exist. Listed dependency in ${parent}.`,
            `Full path: ${resolve(filePath)}.`
        ].join('\n'));
    }
    if (isString(parent)) {
        dep.splice(dep.indexOf(parent), 0, filePath);
    } else {
        dep.unshift(filePath);
    }
    const imports = getFileImports(content);
    return imports.reduce((arr, d) => {
        const module = d[0];
        const pathModule = join(dirname(filePath), module);
        if (arr.indexOf(pathModule) === -1) {
            arr = getOrderedDependencies(module, filePath, arr);
        }
        return arr;
    }, dep);
};

const getExcludedFilenames = (requires, base) => requires
    .reduce((arr, name) => {
        const filePath = join(base, `${name.replace('highcharts/', '')}.src.js`);
        const dependencies = exists(filePath) ?
            getOrderedDependencies(filePath).map(str => resolve(str)) :
            [];
        return arr.concat(dependencies);
    },
    []);

const getListOfFileDependencies = pathFile => {
    let result = false;
    if (exists(pathFile)) {
        const content = getFile(pathFile);
        result = getFileImports(content);
    }
    return result;
};

const cleanPath = path => {
    const parts = path.split('/')
        .reduce((arr, piece) => {
            if (piece !== '.' || arr.length === 0) {
                arr.push(piece);
            }
            return arr;
        }, [])
        .reduce((arr, piece) => {
            if (piece === '..') {
                if (arr.length === 0) {
                    arr.push(piece);
                } else {
                    const popped = arr.pop();
                    if (popped === '.') {
                        arr.push(piece);
                    } else if (popped === '..') {
                        arr.push(popped);
                        arr.push(piece);
                    }
                }
            } else {
                arr.push(piece);
            }
            return arr;
        }, []);
    return parts.join('/');
};


const indent = (str, char) => str
    .split('\n')
    .map(line => ((line.trim() === '' ? '' : char) + line))
    .join('\n');

const applyUMD = (content, path) => templateUMDStandalone
    .replace(/@name/g, safeReplace('Highcharts'))
    .replace(/@path/g, safeReplace(path))
    .replace('@content', safeReplace(indent(content, IND)));

const applyModule = content =>
    templateUMDModule.replace('@content', safeReplace(indent(content, IND)));

/**
 * Adds a license header to the top of a distribution file.
 * License header is collected from the "masters" file.
 * @param  {string} content Content of distribution file.
 * @param  {object} o Object containing all build options.
 * @return {string} Returns the distribution file with a header.
 */
const addLicenseHeader = (content, { entry }) => {
    const string = getFile(entry);
    let header = getLicenseBlock(string);
    if (header) {
        header = [' * @module', ' * @requires']
        // Find tags in header
            .reduce((arr, str) => arr.concat(searchCapture(header, str, '\n')), [])
        // Remove found tags from header
            .reduce((headr, tag) => headr.replace(tag, safeReplace('')), header);
    }
    return (isString(header) ? header + '\n' : '') + content;
};

/**
 * Removes a license code block from a string.
 * @param  {string} content Module content.
 * @return {string} Returns module content without license header.
 */
const removeLicenseHeader = content => content
    .replace(getLicenseBlock(content), safeReplace(''));

const removeStatement = (str, statement) => {
    let result;
    let start = str.indexOf(statement);
    let end = start + statement.length;
    // Remove following semi colon
    if (str[end] === ';') {
        end += 1;
    }
    // Check wether there is multiple statements on the same line.
    const isLineEndAfter = str.indexOf('\n', end) > -1;
    const lineEndAfter = (
        isLineEndAfter ?
            str.indexOf('\n', end) + 1 :
            str.length
    );
    const lineEndBefore = (
        str.lastIndexOf('\n', start) > -1 ?
            str.lastIndexOf('\n', start) + 1 :
            0
    );
    const isEmptyAfter = str.substring(end, lineEndAfter).trim().length === 0;
    const isEmptyBefore = str.substring(lineEndBefore, start).trim().length === 0;
    if (isEmptyAfter && isEmptyBefore) {
        start = lineEndBefore;
        // If no line ending after, then trim the line ending before
        if (!isLineEndAfter) {
            ['\n', '\r'].forEach(char => {
                if (str[start - 1] === char) {
                    start -= 1;
                }
            });
        }
        end = lineEndAfter;
        result = str.substring(0, start) + str.substring(end);
    } else if (isEmptyBefore) {
        result = str.substring(0, start) + str.substring(end).trimLeft();
    } else {
    /* If the statement is in the middle of multiple statements, or at the end
       of a line */
        result = str.substring(0, start).trimRight() + str.substring(end);
    }
    return result;
};

/**
 * Removes a list of statements from a string
 * @param {String} str The string to operate on.
 * @param {Array} statements A list of statements to remove.
 * @return {String|boolean} Returns a string without the given statements
 */
const removeStatements = (str, statements) => {
    let result = false;
    if (isString(str)) {
        if (isArray(statements)) {
            result = statements.reduce(
                (prev, statement) => removeStatement(prev, statement),
                str
            );
        } else {
            result = str;
        }
    }
    return result;
};

/**
 * Returns the export statements in a given string.
 * @param {String} content The string to look in.
 * @return {Array} List of export statements.
 */
const getExportStatements = content => {
    const result = [];
    const word = 'export default ';
    const start = content.indexOf(word);
    if (start > -1) {
        let endChar;
        if (!content.includes('\n', start)) {
            endChar = ';';
        } else if (!content.includes(';', start)) {
            endChar = '\n';
        } else {
            endChar = (
                content.indexOf('\n', start) < content.indexOf(';', start) ?
                    '\n' :
                    ';'
            );
        }
        const end = (
            content.includes(endChar, start) ?
                content.indexOf(endChar, start) :
                content.length
        );
        result.push(content.substring(start, end));
    }
    return result;
};

const getExportedVariables = content => {
    const statements = getExportStatements(content);
    // TODO support named exports.
    // TODO support having multiple exports in the same file.
    return (
        isString(statements[0]) ?
            statements[0].replace('export default ', safeReplace('')) :
            null
    );
};

/* eslint-disable valid-jsdoc */
/**
 * Get tuples of all the imported variables for each module.
 * @return {[string, [string, string]]} List of all the module parameters and its inserted parameters
 */
const getImports = (pathModule, content) => {
    const imports = getFileImports(content);
    return imports.reduce((arr, [path, param]) => {
        if (param) {
            // TODO check if import is of object structure and not just default
            arr.push([
                param,
                join(dirname(pathModule), path).split('\\').join('/')
            ]);
        }
        return arr;
    }, []);
};
/* eslint-enable valid-jsdoc */

/**
 * Transform a module into desired structure
 * @param  {string} content  Content of the module
 * @param  {object} options Options object
 * @param  {string} options.path     Path to the module file
 * @param  {[string, string]} options.imported Parameters which the module imports
 * @param  {string} options.exported    The name of the default variable exported by the module
 * @param  {number} options.i        Index in dependencies array.
 * @param  {[string]} options.arr      Dependencies array
 * @return {string} The module content after transformation
 */
const moduleTransform = (content, options) => {
    const {
        exclude = [],
        exported,
        imported,
        path,
        printPath
    } = options;
    const doExclude = (
        isArray(exclude) ?
            exclude.includes(path) :
            regexTest(exclude, path)
    );
    let result = '';
    if (!doExclude) {
    // Remove license headers from modules
        result = removeLicenseHeader(content);
        // Remove use strict from modules
        result = result.replace(/'use strict';\r?\n/, safeReplace(''));
        // Remove import statements
        // TODO Add imported variables to the function arguments. Reuse getImports
        // for this
        result = result.replace(/import\s[^\n]+\n/g, safeReplace(''));
        const exportStatements = getExportStatements(result);
        result = removeStatements(result, exportStatements);
        const body = result + (exported ? LE + 'return ' + exported + ';' : '');

        const params = imported.map(m => m[0]).join(', ');
        const mParams = imported.map(m => `_modules['${m[1]}']`).join(', ');

        result = templateWrapModule
            .replace('@path', safeReplace(printPath))
            .replace('@params', safeReplace(params))
            .replace('@mParams', safeReplace(mParams))
            .replace('@content', safeReplace(indent(body, IND)));
    }
    return result;
};

/**
 * Apply transformation to the compiled file content.
 * @param  {string} content Content of file
 * @param  {object} options fileOptions
 * @return {string}         Content of file after transformation
 */
const fileTransform = (content, options) => {
    const { entry, moduleName, umd, printPath, requires } = options;
    let result = umd ? applyUMD(content, printPath) : applyModule(content);
    result = addLicenseHeader(result, { entry });
    return result
        .replace('@moduleName', moduleName ? `'${moduleName}', ` : '')
        .replace('@AMDParams', requires.length ? 'Highcharts' : '')
        .replace('@AMDFactory', requires.length ?
            '\n' + indent('factory(Highcharts);\nfactory.Highcharts = Highcharts;', IND.repeat(3)) :
            '')
        .replace(/@dependencies/g, safeReplace(requires.join('\', \'')));
};

const compileFile = options => {
    // Collect values from the options object
    const { entry, base } = options;

    // Get contents of the entry file
    const contentEntry = getFile(entry);

    /* Assign values to requires, exclude and umd, or use the value from options
     if provided by the user */
    const {
        requires = getRequires(contentEntry),
        exclude = getExcludedFilenames(requires, base),
        umd = requires.length === 0,
        moduleName = getModuleName(contentEntry)
    } = options;

    // Transform modules
    const mapTransform = path => {
        const printPath = relative(join(base, '../'), path)
            .split('\\').join('/');
        const content = getFile(path);
        return moduleTransform(content, {
            exclude,
            exported: getExportedVariables(content),
            imported: getImports(printPath, content),
            path,
            printPath
        });
    };
    const modules = getOrderedDependencies(entry)
        .map(mapTransform)
        .filter(m => m !== '')
        .join(LE);

    const printPath = relative(join(base, '../'), entry).split('\\').join('/');
    return fileTransform(
        modules,
        { entry, moduleName, umd, printPath, requires }
    );
};

module.exports = {
    cleanPath,
    compileFile,
    getExportStatements,
    getFileImports,
    getImportInfo,
    getListOfFileDependencies,
    getModuleName,
    getOrderedDependencies,
    getRequires,
    isImportStatement,
    isInsideBlockComment,
    isInsideSingleComment,
    regexGetCapture,
    removeStatement,
    removeStatements
};
