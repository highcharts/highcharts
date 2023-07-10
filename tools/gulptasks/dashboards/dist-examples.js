/* eslint-disable no-console */

const Gulp = require('gulp');
const { join } = require('node:path');
const { writeFile, readFile, rm, lstat } = require('node:fs/promises');
const { getDemoBuildPath } = require('../dist-examples.js');

const TARGET_DIRECTORY = join('build', 'dist');

async function readJSONFile(filePath) {
    const fileContent = await readFile(filePath);
    return JSON.parse(fileContent);
}

async function cleanupExampleDir(examplesDir) {
    const filesToClean = [
        'demo.html',
        'demo.details',
        'test-notes.md'
    ];

    for (const fileName of filesToClean) {
        await rm(
            join(examplesDir, fileName),
            { force: true }
        );
    }
}

async function transformExampleDir(examplesDir) {

    const files = [
        'demo.css',
        'demo.js',
        'demo.html'
    ];

    files.forEach(async fileName => {
        let filePath = join(examplesDir, fileName);
        const contents = await readFile(filePath, 'utf-8');

        let newContent = contents
            .replaceAll('https://code.highcharts.com/dashboards/', '../../code/')
            .replaceAll(/(?<!\.src)\.js(?!on)/gmu, '.src.js"');

        if (fileName === 'demo.html') {
            filePath = filePath.replace('demo.html', 'index.html');
            newContent = `<link rel="stylesheet" type="text/css" href="./demo.css">
${newContent}
<script src="demo.js"></script>
`;
        }

        await writeFile(
            filePath,
            newContent
        );

    });
}

async function dashboardsDistExamples(done) {
    const demoPath = join(getDemoBuildPath().replace('tmp/demo', ''), 'frontend', 'tmp');

    await lstat(demoPath)
        .catch(error => {
            if (error.code === 'ENOENT') {
                console.error(`Could not find ${demoPath}.

See https://github.com/highcharts/highcharts-demo-manager/tree/master/frontend for instructions on how to build the required files.

Exiting...
                `);

                done();
                return;

            }

            console.error(error);
            done();
        });

    const products = [{
        name: 'Highcharts Dashboards',
        id: 'highcharts-dashboards',
        distName: 'dashboards',
        path: 'dashboards/demo'
    }];

    products.forEach(async ({ name, id, path, distName }) => {
        const output = [];
        output.push(`<h1>${name} examples</h1>`);

        const categories = await readJSONFile(join(demoPath, 'sidebar/ids', `${id}.json`));

        await Promise.all(categories.map(async categoryID => {
            const demos = await readJSONFile(join(demoPath, 'categories', categoryID + '.json'));
            output.push('<ul>');
            demos.forEach(async demo => {
                const regex = new RegExp(`.*samples/${path}/`, 'u');

                const demoExamplePath = demo.location.replace(regex, '');

                output.push(`<li><a href="./examples/${demoExamplePath}/index.html">${demo.name}</a></li>`);

                const examplesDirPath = join('build', 'dist', distName, 'examples', demoExamplePath);

                await transformExampleDir(examplesDirPath);
                await cleanupExampleDir(examplesDirPath);

            });
            output.push('</ul>');
        }));

        await writeFile(
            join(TARGET_DIRECTORY, distName, 'index.html'),
            output.join('\n')
        );
    });
}

Gulp.task('dashboards/dist-examples', dashboardsDistExamples);
