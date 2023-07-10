/* eslint-disable no-console */

const Gulp = require('gulp');
const { join } = require('node:path');
const { writeFile, readFile, rm, lstat } = require('node:fs/promises');
const { getDemoBuildPath } = require('../dist-examples.js');

const yargs = require('yargs');

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

    for (const fileName of files) {
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
    }
}

const helpText =
    `
Requires demo.path to be set in git-ignore-me.properties. This should be set to the output folder of the highcharts-demo-manager frontend. Example: '../highcharts-demo-manager/frontend/tmp/';

Resources:
* https://github.com/highcharts/highcharts-demo-manager/tree/master/frontend
    `;

async function dashboardsDistExamples(done) {
    if (yargs.argv.helpme) {
        console.log(helpText);
        done();
    }

    const demoPath = getDemoBuildPath();

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

    for (const { name, id, path, distName } of products) {
        const output = [];
        output.push(`<h1>${name} examples</h1>`);

        const categories = await readJSONFile(join(demoPath, 'sidebar/ids', `${id}.json`));

        for (const categoryID of categories) {
            const demos = await readJSONFile(join(demoPath, 'categories', categoryID + '.json'));
            output.push('<ul>');

            for (const demo of demos) {
                const regex = new RegExp(`.*samples/${path}/`, 'u');

                const demoExamplePath = demo.location.replace(regex, '');

                output.push(`<li><a href="./examples/${demoExamplePath}/index.html">${demo.name}</a></li>`);

                const examplesDirPath = join('build', 'dist', distName, 'examples', demoExamplePath);

                await transformExampleDir(examplesDirPath);
                await cleanupExampleDir(examplesDirPath);
            }

            output.push('</ul>');

        }

        await writeFile(
            join(TARGET_DIRECTORY, distName, 'index.html'),
            output.join('\n')
        ).then(done);
    }

}

Gulp.task('dashboards/dist-examples', dashboardsDistExamples);
