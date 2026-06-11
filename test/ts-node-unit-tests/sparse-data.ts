
import assert from 'node:assert';
import H from '../../ts/Core/Globals';
import '../../ts/Core/Chart/Chart';
import '../../ts/Series/Column/ColumnSeries';
import SeriesRegistry from '../../ts/Core/Series/SeriesRegistry';
import utilities from '../../ts/Core/Utilities';

const { merge } = utilities;
const ColumnSeries = SeriesRegistry.seriesTypes.column;

// Mock classes
class MockAxis {
    options = { reversedStacks: false };
    reversed = false;
    transA = 100;
    closestPointRange = 1;
    len = 500;
    pos = 0;
    chart: any;
    series: any[] = [];
    stacking: any; // Add stacking property
    constructor(chart: any) {
        this.chart = chart;
        this.series = [];
    }
}

class MockChart {
    series: any[] = [];
    plotLeft = 0;
    plotTop = 0;
    clipOffset = [0, 0, 0, 0];
    inverted = false;
    renderer = {
        createElement: () => ({ attr: () => { }, add: () => { }, css: () => { } })
    };
    pointCount = 0;
    stacking = { stacks: {} };
    constructor() { }
}

async function runTest() {
    console.log('--- Starting Sparse Data Test ---');
    const chart = new MockChart();
    const xAxis = new MockAxis(chart);
    const yAxis = new MockAxis(chart);

    const seriesOptions = {
        type: 'column',
        grouping: true,
        pointPadding: 0.2, // 20%
        groupPadding: 0.2, // 20%
        centerInCategory: true // REQUIRED for fix
    };

    // Create 2 series
    const s1 = new ColumnSeries();
    s1.chart = chart as any;
    s1.xAxis = xAxis as any;
    s1.yAxis = yAxis as any;
    s1.options = merge(ColumnSeries.defaultOptions, seriesOptions);
    s1.visible = true;
    s1.reserveSpace = () => true;
    s1.name = 'S1';

    const s2 = new ColumnSeries();
    s2.chart = chart as any;
    s2.xAxis = xAxis as any;
    s2.yAxis = yAxis as any;
    s2.options = merge(ColumnSeries.defaultOptions, seriesOptions);
    s2.visible = true;
    s2.reserveSpace = () => true;
    s2.name = 'S2';

    chart.series = [s1, s2];
    xAxis.series = [s1, s2];
    s1.index = 0;
    s2.index = 1;

    // Get metrics (Global count = 2)
    // CategoryWidth = 100
    // GroupPadding = 20 (each side) => GroupWidth = 60
    // PointOffsetWidth = 60 / 2 = 30
    // PointPadding = 0.2
    // PointWidth = 30 * (1 - 0.4) = 18
    const metricsDense = s1.getColumnMetrics();
    console.log('Metrics (Global):', metricsDense);
    assert.strictEqual(metricsDense.columnCount, 2, 'Global column count should be 2');

    // Test adjustForMissingColumns directly
    console.log('--- Testing adjustForMissingColumns ---');

    // Mock stacking to represent the "Series structure in category"
    // Case 1: Sparse (Only S1 has data in Cat 0)
    xAxis.stacking = {
        stacks: {
            // StackKey (e.g. 'column')
            'default': {
                // Category 0
                '0': {
                    points: {
                        [s1.index]: [10, 10] // S1 has data
                    }
                },
                // Category 1
                '1': {
                    points: {
                        [s1.index]: [10, 10],
                        [s2.index]: [20, 20]
                    }
                }
            }
        }
    };

    const pointSparse = {
        isNull: false,
        x: 0,
        plotX: 100,
        series: s1
    };

    // s1.adjustForMissingColumns should now return a WIDER width
    // If only 1 series:
    // GroupWidth = 60
    // Count = 1
    // PointOffset = 60
    // PointWidth = 60 * 0.6 = 36

    const adjustedSparse = s1.adjustForMissingColumns(
        100,
        metricsDense.width,
        pointSparse as any,
        metricsDense
    );

    console.log('Adjusted Sparse:', adjustedSparse);

    // Check if returns object
    if (typeof adjustedSparse === 'number') {
        console.error('FAIL: adjustForMissingColumns returned number, expected object');
        process.exit(1);
    }

    assert.ok(adjustedSparse.width > metricsDense.width, `Sparse width (${adjustedSparse.width}) should be > Dense width (${metricsDense.width})`);
    assert.strictEqual(Math.round(adjustedSparse.width), 36, 'Sparse width should be ~36');

    // Case 2: Dense (Both present in Cat 1)
    const pointDense = {
        isNull: false,
        x: 1,
        plotX: 200,
        series: s1
    };

    const adjustedDense = s1.adjustForMissingColumns(
        200,
        metricsDense.width,
        pointDense as any,
        metricsDense
    );

    console.log('Adjusted Dense:', adjustedDense);
    assert.ok(Math.abs(adjustedDense.width - metricsDense.width) < 1, `Dense width (${adjustedDense.width}) should be ~${metricsDense.width}`);

    console.log('PASS: All checks passed');
}

runTest().catch(err => {
    console.error(err);
    process.exit(1);
});
