const gulp = require('gulp');

// Gulp task to transpile .jsx to .mjs
async function transpileJSXSamples() {
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

    function html(strings, ...values) {
        let str = `
            <script type="importmap">
            {
                "imports": {
                    "react": "https://esm.sh/react@18.3.1",
                    "react-dom": "https://esm.sh/react-dom@18.3.1/client",
                    "highcharts-react-official": "https://esm.sh/gh/highcharts/highcharts-react@v4-dev/index.js"
                }
            }
            </script>
            <figure class="highcharts-figure">
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
    const swc = require('@swc/core');

    const jsxFiles = glob.iterate('samples/**/demo.jsx');

    const { writeFile, readFile } = require('node:fs/promises');

    for await (const jsxPath of jsxFiles) {
        const originalCode = await readFile(jsxPath, 'utf8');
        const output = await swc.transform(originalCode, config);

        const adjecentHTMLFile = jsxPath.toString().replace('.jsx', '.html');

        await writeFile(
            adjecentHTMLFile,
            html`<details><summary>Code</summary><code><pre>${originalCode}</pre></code></details>`,
            { force: true }
        );
        await writeFile(jsxPath.replace('.jsx', '.mjs'), output.code);
    }

}

module.exports = {
    transpileJSXSamples
};

gulp.task('prepare-react-samples', transpileJSXSamples);
