/* eslint-disable no-undefined */
module.exports = {
    base: null, // Path to where the build files are located
    date: null,
    exclude: undefined,
    fileOptions: {},
    files: null, // Array of files to compile
    jsBase: null, // Path to where the js folder is located. Used when masters file is not in same location as the source files.
    output: './', // Folder to output compiled files
    palette: null, // Highcharts palette
    pretty: true,
    product: 'Highcharts', // Which product we're building.
    umd: undefined, // Wether to use UMD pattern or a module pattern
    version: 'x.x.x', // Version number of Highcharts
    /**
     * Transpile ES6 to ES5.
     * Do not activate without seriously considering performance first.
     * Once activated in one system, it will have to be activated in all.
     * Requires babel-core@^6.21.0 and additional presets.
     */
    transpile: false,
    type: 'classic' // Type of Highcharts version. Classic or css.
};
/* eslint-enable no-undefined */
