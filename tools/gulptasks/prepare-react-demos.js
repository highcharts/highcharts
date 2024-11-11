const gulp = require('gulp');
const path = require('path');


// Define source and destination directories
const paths = {
    src: 'samples/**/demo.jsx', // Update this path to match your directory structure
    dest: 'samples/'
};

const config = {
    jsc: {
        parser: {
            syntax: 'ecmascript',
            jsx: true
        },
        target: 'es2020' // Set the desired JavaScript version
    },
    module: {
        type: 'es6'
    }
};

// Gulp task to transpile .jsx to .mjs
async function transpileDemoFiles() {

    function html(strings, ...values) {
        let str = `<figure class="highcharts-figure">
                    <div id="container"></div>
                </figure>`;

        for (let i = 0; i < strings.length; i++) {
            str += strings[i];

            if (i < strings.length - 1) {
                str += values[i]
                    .replaceAll('<', '&lt;').replaceAll('>', '&gt;');
            }
        }

        return str;
    }

    const { glob } = require('glob');
    const jsxFiles = glob.iterate(paths.src);
    const swc = require('@swc/core');

    const { writeFile, readFile } = require('node:fs/promises');

    for await (const jsxPath of jsxFiles) {

        const originalCode = await readFile(jsxPath, 'utf8');
        const output = await swc.transform(originalCode, config);

        const adjecentHTMLFile = jsxPath.toString().replace('.jsx', '.html');

        await writeFile(adjecentHTMLFile, html`<details><summary>Code</summary><code><pre>${originalCode}</pre></code></details>`, { force: true });


        await writeFile(jsxPath.replace('.jsx', '.mjs'), output.code);
    }

}

// Default Gulp task
exports.default = gulp.task('prepare-react-demos', transpileDemoFiles);
