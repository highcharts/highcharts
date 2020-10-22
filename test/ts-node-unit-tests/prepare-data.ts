import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'fs';
import path from 'path';

console.log('preparing data')
const testDir = '';

// Set up generated test data
mkdirSync(path.join(testDir, 'test-data'), { recursive: true });

// Set up a series list for each product
const productModules = [
    'map',
    'stock',
    'gantt',
    'highcharts'
];

productModules.forEach(product => {
    const modulePath = product === 'highcharts' ? `../../code/es-modules/masters/${product}.src.js` :
        `../../code/es-modules/masters/modules/${product}.src.js`;

    if (existsSync(modulePath)) {
        const series =
            (
                readFileSync(modulePath, 'utf-8')
                    .match(/(?<=\/Series\/).*(?=Series\.js)/g) || []
            )
                .map((s: string) => s.toLowerCase());

        writeFileSync(`./test-data/${product}-series.ts`, `export default ${JSON.stringify(series)}`);
    }
});

// Indicators
const indicatorPath = '../../code/es-modules/masters/indicators/indicators-all.src.js';
if (existsSync(indicatorPath)) {
    const indicators = (readFileSync(indicatorPath, 'utf-8')
        .match(/(?<=\/Indicators\/).*(?=\.js)/g) || [])
        .map((indicator: string)=> indicator.toLowerCase());

    writeFileSync('./test-data/indicators.ts', `export default ${JSON.stringify(indicators)}`);
}

// Compile the typescript tests
// try {
//     //execSync('npx tsc');
// } catch (error) {
//     console.error('Typescript error');
// }
