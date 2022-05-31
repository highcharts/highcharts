import { describe } from '../test-utils';
import { JSDOM } from 'jsdom';
import { strictEqual } from 'assert';

export function testDOMDependencies() {
    describe('Testing DOM dependencies...');
    const dom = new JSDOM(
        `<!doctype html>
        <html>
            <body>
                <div id="container"></div>
            </body>
        </html>`
    );
    const Highcharts = require('../../../code/highcharts.src.js')(dom.window);
    Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3],
            dataLabels: {
                enabled: true
            }
        }]
    }, (chart) => {
        strictEqual(
            chart.series.length,
            1,
            'Chart should have a series without "Node is not defined" error.'
        );
    });
}
