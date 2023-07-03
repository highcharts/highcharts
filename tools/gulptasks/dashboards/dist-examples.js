const Gulp = require('gulp');
const { join } = require('node:path');
const { writeFile, readFile } = require('node:fs/promises');
const { getDemoBuildPath } = require('../dist-examples.js');

const TARGET_DIRECTORY = join('build', 'dist');

async function readJSONFile(filePath) {
    const fileContent = await readFile(filePath);
    return JSON.parse(fileContent);
}

async function dashboardsDistExamples() {
    const demoPath = join(getDemoBuildPath().replace('tmp/demo', ''), 'frontend', 'tmp');

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
            demos.forEach(demo => {
                const regex = new RegExp(`.*samples/${path}/`, 'u');

                const demoExamplePath = demo.location.replace(regex, '');
                output.push(`<li><a href="https://highcharts.com/samples/${distName}/demo/${demoExamplePath}">${demo.name}</a></li>`);
            });
            output.push('</ul>');
        }));

        return writeFile(join(TARGET_DIRECTORY, distName, 'index.html'), output.join('\n'));
    });

    await Promise.all(promises);
}

Gulp.task('dashboards/dist-examples', dashboardsDistExamples);
