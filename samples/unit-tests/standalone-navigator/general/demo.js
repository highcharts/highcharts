QUnit.test('Standalone navigator general tests', function (assert) {
    const series = [{
        data: [1, 2, 3, 4, 3, 2, 1],
        pointInterval: 10000000000
    }];
    const container1 = document.createElement('div');
    document.getElementById('container').appendChild(container1);
    container1.id = 'navigator';
    const container2 = document.createElement('div');
    document.getElementById('container').appendChild(container2);
    container2.id = 'chart';

    const navigator = Highcharts.navigator('navigator', {
        height: 150,
        series
    });

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        150,
        'Standalone navigator container should have correct height, #21268.'
    );

    navigator.update({
        height: 200
    });

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        200,
        `Standalone navigator container should have correct height after update,
        #21268.`
    );

    // #23809
    const chart = Highcharts.stockChart('chart', {
        series,
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        xAxis: {
            minRange: 1
        }
    });

    navigator.bind(chart);

    const rangeSelector = chart.rangeSelector;
    rangeSelector.clickButton(1);

    assert.strictEqual(
        navigator.getRange().min,
        chart.xAxis[0].getExtremes().min,
        `Standalone navigator min should be equal to chart min, after clicking
        range selector button, #23809.`
    );

    assert.strictEqual(
        navigator.getRange().max,
        chart.xAxis[0].getExtremes().max,
        `Standalone navigator max should be equal to chart max, after clicking
        range selector button, #23809.`
    );

    rangeSelector.setInputValue('min', 0);
    Highcharts.fireEvent(rangeSelector.minInput, 'change');

    assert.strictEqual(
        navigator.getRange().min,
        0,
        `Standalone navigator should react to range selector input value change,
        #23809.`
    );

    // Cleanup after appending multiple containers
    navigator.destroy();
    container1.parentNode.removeChild(container1);
    chart.destroy();
    container2.parentNode.removeChild(container2);
});

QUnit.test('DataTable in Standalone Navigator.', function (assert) {
    const dataTable = new Highcharts.DataTable({
        columns: {
            x: [1, 2, 3, 4, 5],
            y: [1, 3, 2, 4, 5]
        }
    });

    const standaloneNavigator = Highcharts.navigator('container', {
        series: [{
            dataTable
        }]
    });

    assert.strictEqual(
        standaloneNavigator.navigator.series[0].points.length,
        dataTable.rowCount,
        'Standalone navigator should render points from DataTable options.'
    );
});

QUnit.test(
    'Panning a y-axis bound to a standalone navigator (#24716)',
    function (assert) {
        const navContainer = document.createElement('div');
        navContainer.style.height = '400px';
        navContainer.style.width = '120px';
        navContainer.id = 'nav-ypan';
        document.getElementById('container').appendChild(navContainer);

        const chartContainer = document.createElement('div');
        chartContainer.style.height = '400px';
        chartContainer.style.width = '600px';
        chartContainer.id = 'chart-ypan';
        document.getElementById('container').appendChild(chartContainer);

        const data = [],
            seriesDataMax = 150;

        for (let i = 0; i < 50; i++) {
            data.push([Date.UTC(2023, 0, 1) + i * 864e5, 100 + i]);
        }

        // Ordinal x-axis stays at its full extent, the standalone navigator is
        // bound to the y-axis. The navigator range is deliberately wider than
        // the series' data
        const chart = Highcharts.stockChart('chart-ypan', {
            chart: {
                panning: {
                    enabled: true,
                    type: 'xy'
                }
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            rangeSelector: {
                enabled: false
            },
            series: [{
                data
            }]
        });

        const navigator = Highcharts.navigator('nav-ypan', {
            chart: {
                chart: {
                    inverted: true,
                    height: 400,
                    width: 120
                }
            },
            series: [{
                data: [
                    [100, 0], [300, 1]
                ]
            }]
        });

        const yAxis = chart.yAxis[0];
        navigator.bind(yAxis, true);

        // Binding a y-axis bounds it to the navigator's range, so panning can
        // traverse the whole navigator rather than only the data extremes
        assert.strictEqual(
            yAxis.options.min,
            100,
            'Binding a y-axis should set min to the navigator data min, #24716.'
        );
        assert.strictEqual(
            yAxis.options.max,
            300,
            'Binding a y-axis should set max to the navigator data max, #24716.'
        );

        // Zoom into a sub-range so there is room to pan vertically
        navigator.setRange(120, 140);

        const yMinBefore = yAxis.min,
            navMinBefore = navigator.getRange().min,
            controller = new TestController(chart),
            cx = chart.plotLeft + chart.plotWidth / 2;

        // Pan up (drag down) repeatedly, past the series' data max
        for (let i = 0; i < 6; i++) {
            controller.pan(
                [cx, chart.plotTop + 20],
                [cx, chart.plotTop + chart.plotHeight - 20]
            );
        }

        assert.notStrictEqual(
            yAxis.min,
            yMinBefore,
            'Panning vertically should change the y-axis extremes even when ' +
            'the ordinal x-axis is at its full extent, #24716.'
        );

        assert.notStrictEqual(
            navigator.getRange().min,
            navMinBefore,
            'The bound standalone navigator should follow the chart y-axis ' +
            'while panning, #24716.'
        );

        assert.ok(
            yAxis.max > seriesDataMax,
            'Panning should move past the series data extremes, up to the ' +
            'navigator range, #24716.'
        );

        // Unbinding should restore the axis' own (unset) bounds
        navigator.unbind(yAxis);

        assert.ok(
            yAxis.options.min === null || yAxis.options.min === void 0,
            'Unbinding should restore the y-axis min bound set by binding, ' +
            '#24716.'
        );
        assert.ok(
            yAxis.options.max === null || yAxis.options.max === void 0,
            'Unbinding should restore the y-axis max bound set by binding, ' +
            '#24716.'
        );

        // Cleanup
        navigator.destroy();
        navContainer.parentNode.removeChild(navContainer);
        chart.destroy();
        chartContainer.parentNode.removeChild(chartContainer);
    }
);