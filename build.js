'use strict';
const d = require('./assembler/dependencies');
const p = require('./assembler/process.js');
const fs = require('fs');
/**
 * [getFilesInFolder description]
 * @param  {[type]} base              [description]
 * @param  {[type]} includeSubfolders [description]
 * @param  {[type]} path              [description]
 * @return {[type]}                   [description]
 */
const getFilesInFolder = (base, includeSubfolders, path) => {
    let filenames = [],
        filepath,
        isDirectory;
        path = (typeof path === 'undefined') ? '' : path;
        fs.readdirSync(base + path).forEach((filename) => {
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

/**
 * Get options foreach individual 
 * @param  {object} options General options for all files
 * @return {[object]}       Array of indiviual file options
 */
const getIndividualOptions = (options) => {
    return options.files.reduce((arr, filename) => {
        let o = Object.assign({}, options, options.fileOptions && options.fileOptions[filename]);
        o.entry = o.base + filename;
        delete o.fileOptions;
        let types = o.type === 'both' ? ['classic', 'css'] : [o.type];
        let typeOptions = types.map(t => {
            let folder = t === 'classic' ? '' : 'js/';
            let build = {
                classic: {
                    assembly: true,
                    classic: true
                },
                css: {
                    classic: false
                }
            };
            return Object.assign({
                build: build[t]
            }, o, {
                type: t,
                outputPath: options.output + folder + filename,
                filename: filename
            });
        });
        return arr.concat(typeOptions);
    }, []);
};

let defaultOptions = {
    base: undefined, // Path to where the build files are located
    exclude: undefined,
    fileOptions: {},
    files: undefined, // Array of files to compile
    output: './', // Folder to output compiled files
    pretty: true,
    umd: true, // Wether to use UMD pattern or a module pattern
    type: 'classic' // Type of Highcharts version. Classic or css.
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
    let options = Object.assign({}, defaultOptions, userOptions);
    // Check if required options are set
    if (options.base) {
        options.files = (options.files) ? options.files : getFilesInFolder(options.base, true);
        getIndividualOptions(options)
            .forEach((o, i, arr) => {
                let compiled = d.compileFile(o);
                let processed = p.preProcess(compiled, o.build);
                fs.writeFileSync(o.outputPath, processed, 'utf8');
                console.log([
                    'Completed ' + (i + 1) + ' of ' + arr.length,
                    '- type: ' + o.type,
                    '- entry: ' + o.entry,
                    '- output: ' + o.outputPath
                ].join('\n'));
            });
    } else {
        outPutMessage('Missing required option!', 'The options \'base\' is required for the script to run');
    }
}

module.exports = {
	build: build
};