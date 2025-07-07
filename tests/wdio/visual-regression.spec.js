import fs from 'fs';
import path from 'path';

const excludeList = [
    // Themes alter the whole default options structure. Set up a
    // separate test suite? Or perhaps somehow decouple the options so
    // they are not mutated for later tests?
    'samples/unit-tests/themes/*/demo.js',

    // --- VISUAL TESTS ---

    // Custom data source
    'samples/highcharts/blog/annotations-aapl-iphone/demo.js',
    'samples/highcharts/blog/gdp-growth-annual/demo.js',
    'samples/highcharts/blog/gdp-growth-multiple-request-v2/demo.js',
    'samples/highcharts/blog/gdp-growth-multiple-request/demo.js',
    'samples/highcharts/website/xmas-2021/demo.js',

    // Error #13, renders to other divs than #container. Sets global
    // options.
    'samples/highcharts/demo/bullet-graph/demo.js',
    // Network loading?
    'samples/highcharts/demo/combo-meteogram/demo.js',

    // CSV data, parser fails - why??
    'samples/highcharts/demo/line-csv/demo.js',

    // Clock
    'samples/highcharts/demo/dynamic-update/demo.js',
    'samples/highcharts/demo/gauge-clock/demo.js',
    'samples/highcharts/demo/gauge-vu-meter/demo.js',

    // Too heavy
    'samples/highcharts/demo/parallel-coordinates/demo.js',
    'samples/highcharts/demo/sparkline/demo.js',

    // Maps
    'samples/maps/demo/map-pies/demo.js', // advanced data
    'samples/maps/demo/us-counties/demo.js', // advanced data
    'samples/maps/plotoptions/series-animation-true/demo.js', // animation
    'samples/highcharts/blog/map-europe-electricity-price/demo.js', // strange fails, remove this later

    // Unknown error
    'samples/highcharts/boost/arearange/demo.js',
    'samples/highcharts/boost/scatter-smaller/demo.js',
    'samples/highcharts/data/google-spreadsheet/demo.js',

    // Various
    'samples/highcharts/data/delimiters/demo.js', // data island
    'samples/highcharts/css/exporting/demo.js', // advanced demo
    'samples/highcharts/css/pattern/demo.js', // styled mode, setOptions
    'samples/highcharts/studies/logistics/demo.js', // overriding

    // Failing on Edge only
    'samples/unit-tests/pointer/members/demo.js',

    // visual tests excluded for now due to failure
    'samples/highcharts/demo/funnel3d/demo.js',
    'samples/highcharts/demo/live-data/demo.js',
    'samples/highcharts/demo/organization-chart/demo.js',
    'samples/highcharts/demo/pareto/demo.js',
    'samples/highcharts/demo/pyramid3d/demo.js',
    'samples/highcharts/demo/synchronized-charts/demo.js',

    // Visual test fails due to external library used
    'samples/highcharts/demo/combo-regression/demo.js',
]
const samplesRoot = path.join(process.cwd(), 'samples/highcharts/demo');
const samples = fs.readdirSync(samplesRoot)
    .filter(name => {
        const samplePath = path.join(samplesRoot, name)
        if (excludeList.some(item => samplePath.includes(item.replace('/demo.js', '')))) return false;

        return fs.statSync(samplePath).isDirectory()
    });

describe('Visual regression: all Highcharts samples', () => {
    for (const sample of samples) {
        it(`should match baseline for ${sample}`, async () => {
            const samplePath = path.join(samplesRoot, sample);

            // load & configure
            await browser.loadSample(samplePath);
            await browser.setTestingOptions();

            // wait for chart
            const chart = await $('#container');
            await chart.waitForStable();
            if (process.env.UPDATE_BASELINE){
                // Don't do the comparison, only save
                await browser.saveElement(
                    chart,
                    sample, // this tag names your baseline file
                    {
                        // optional: tweak thresholds or blockOutAreas here
                        pixelThresholdType: 'percent',
                            pixelThreshold: 0.1
                    }
                );
            } else {
                // capture & compare
                const diff = await browser.checkElement(
                    chart,
                    sample, // this tag names your baseline file
                    {
                        // optional: tweak thresholds or blockOutAreas here
                        pixelThresholdType: 'percent',
                            pixelThreshold: 0.1
                    }
                );
                expect(diff).toBeLessThanOrEqual(0.1);
            }
        });
    }
});
