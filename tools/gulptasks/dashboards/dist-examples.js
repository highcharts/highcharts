const Gulp = require('gulp');
const { join } = require('node:path');
const { writeFile, readFile, rm } = require('node:fs/promises');
const { getDemoBuildPath } = require('../dist-examples.js');

const TARGET_DIRECTORY = join('build', 'dist');

async function readJSONFile(filePath) {
    const fileContent = await readFile(filePath);
    return JSON.parse(fileContent);
}

function cleanupExampleDir(examplesDir) {
    return Promise.all(
        [
            'demo.html',
            'demo.details',
            'test-notes.md'
        ].map(fileName =>
            rm(
                join(examplesDir, fileName),
                { force: true }
            ))
    );
}

async function transformExampleDir(examplesDir) {
    return Promise.all(
        [
            'demo.css',
            'demo.js',
            'demo.html'
        ].map(
            async fileName => {

                const filePath = join(examplesDir, fileName);
                const contents = await readFile(filePath, 'utf-8');

                const newContent = contents
                    .replaceAll('https://code.highcharts.com/dashboards/', '../../code/')
                    .replaceAll(/(?<!\.src)\.js(?!on)/gmu, '.src.js"');

                if (fileName === 'demo.html') {
                    return writeFile(
                        filePath.replace('demo.html', 'index.html'),
                        `<link rel="stylesheet" type="text/css" href="./demo.css">
${newContent}
<script src="demo.js"></script>
`
                    );
                }

                return writeFile(
                    filePath,
                    newContent
                );

            }
        )
    );
}

async function dashboardsDistExamples() {
    const demoPath = join(getDemoBuildPath().replace('tmp/demo', ''), 'frontend', 'tmp');

    // TODO: error if demoPath does not exist

    const products = [{
        name: 'Highcharts Dashboards',
        id: 'highcharts-dashboards',
        distName: 'dashboards',
        path: 'dashboards/demo'
    }];

    const promises = products.map(async ({ name, id, path, distName }) => {
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

        return writeFile(
            join(TARGET_DIRECTORY, distName, 'index.html'),
            output.join('\n')
        );
    });

    await Promise.all(promises);
}

Gulp.task('dashboards/dist-examples', dashboardsDistExamples);
