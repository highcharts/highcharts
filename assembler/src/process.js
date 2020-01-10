/* eslint-env node, es6 */
/* eslint func-style: ["error", "expression"] */
'use strict';
const fs = require('fs');
const {
    writeFile
} = require('./utilities.js');

const getFunction = (body, args) => {
    const a = [null].concat((args || []), [body]); // context + arguments + function body
    let f;
    try {
        f = new (Function.prototype.bind.apply(Function, a))(); // eslint-disable-line no-new-func
    } catch (e) {
        writeFile('temp.js', body);
        const message = [
            'Construction of function failed. Caused by: ' + e.message,
            'This issue is likely caused by "super-code comments" in your source code',
            'To debug the "super-code" please have a look at function body in temp.js'
        ].join('\n');
        throw new Error(message);
    }
    return f;
};

/**
 * Parse the highcharts.scss file for palette colors
 * @param {string} path Path to the style file
 * @return {object} Palette object
 */
const getPalette = path => {
    const lines = fs.readFileSync(path, 'utf8');
    return lines.split('\n').reduce((obj, line) => {
        let parts;
        let key;
        let val;
        if (line.indexOf('$') === 0) {
            parts = line
                .replace(' !default', '')
                .replace(/\r/, '').split(':');
            key = parts[0].trim().replace(/^\$/, '')
            // Camelcase
                .replace(/-([a-z0-9])/g, g => g[1].toUpperCase());
            val = parts[1].split(';')[0].trim();

            obj[key] = val;
        }
        return obj;
    }, {});
};

/**
 * Creates a html file from a palette object and prints it to palette.html
 * @param  {string} path Path to where the file should be output.
 * @param  {object} palette Palette object, contains all Sass variables.
 * @return {undefined} Returns nothing
 */
const printPalette = (path, palette) => {
    const keys = Object.keys(palette);
    let html = `
        <title>Palette - Highcharts</title>
        <h1>Palette - Highcharts</h1>
        <p>${keys.length} colors</p>
    `;
    let val;

    // Print series colors
    html += palette.colors.split(' ').map(color => `
            <div style="float: left; background-color: ${color}; width: 10%; height: 100px"></div>
        `).join('');

    // Sort by color
    /*
    keys.sort((a, b) => {
        return palette[a] > palette[b];
    });
    */

    keys.forEach(key => {
        if (key === 'strongColor' || key === 'activeColor') {
            html += '<br style="clear:both">';
        }
        if (key !== 'colors') {
            val = palette[key];
            html += `
                <div style="float: left; width: 200px; border: 1px solid silver; margin: 5px">
                    <h4 style="text-align: center">${key}</h4>
                    <p style="text-align: center">${val}</p>
                    <div style="background-color: ${val}; width: 100%; height: 100px"></div>
                </div>
            `;
        }
    });
    writeFile(path, html);
};

// eslint-disable-next-line valid-jsdoc
/**
 * Avoid accidentally replacing special replacement patterns
 */
const safeReplace = x => () => x;

const preProcess = (content, { build, product, version, date }) => {
    let tpl = content
        .replace(/\r\n/g, '\n') // Windows newlines
        .replace(/"/g, '___doublequote___') // Escape double quotes and backslashes, to be reinserted after parsing
        .replace('/[ ,]/', '___rep3___') // Conflicts with trailing comma removal below
        .replace('/[ ,]+/', '___rep4___') // Conflicts with trailing comma removal below
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n') // Prepare newlines
        .replace(/^/, 'var s = "') // Start supercode output, start first output string
        .replace(/\/\*=\s?/g, '";\n') // Start supercode block, closes output string
        .replace(/=\*\//g, '\ns += "') // End of supercode block, starts output string
        .replace(/$/, '";\nreturn s;'); // End supercode output, end last output string

    // The evaluation function for the ready built supercode
    const supercode = getFunction(tpl, ['build']);

    // Collect trailing commas left when the template engine has removed
    // object literal properties or array items
    tpl = supercode(build)
        .replace(/,(\s*(\]|\}))/g, '$1')
        .replace(/___doublequote___/g, '"')
        .replace(/___rep3___/g, '/[ ,]/')
        .replace(/___rep4___/g, '/[ ,]+/')
    // Replace palette colors
        .replace(/\$\{palette\.([a-zA-Z0-9]+)\}/g, function (match, key) {
            // @notice Could this not be done in the supercode function?
            if (build.palette[key]) {
                return build.palette[key];
            }
            throw new Error('${palette.' + key + '} not found in SASS file');
        });

    // Replace product tags
    tpl = tpl.replace(/@product.name@/g, safeReplace(product))
        .replace(/@product.version@/g, safeReplace(version))
        .replace(/@product.date@/g, safeReplace(date));

    return tpl;
};

const transpile = content => {
    // eslint-disable-next-line node/no-missing-require
    const babel = require('babel-core');
    return babel.transform(content, {
        extends: './assembler/.babelrc'
    }).code;
};

module.exports = {
    getFunction,
    getPalette,
    preProcess,
    printPalette,
    transpile
};
