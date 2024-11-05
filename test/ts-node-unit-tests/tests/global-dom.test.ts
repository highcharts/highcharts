import { loadHCWithModules } from '../test-utils';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe('Testing DOM dependencies', () => {
    it('Chart should have a series without "Node is not defined" error', () => {
        const Highcharts = loadHCWithModules();
        const chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3],
                dataLabels: {
                    enabled: true
                }
            }]
        });

        strictEqual(
            chart.series.length,
            1
        );
    });
});
