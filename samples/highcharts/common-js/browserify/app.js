/* eslint-env node*/
QUnit.test("Highcharts in use with the standalone-framework.", function (assert) {

    var hcFramework = require('../../../../js/adapters/standalone-framework.src'),
        Highcharts = require('../../../../js/highcharts.src')(hcFramework);

    var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container'
            },
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        });

    assert.strictEqual(
        window.HighchartsAdapter,
        undefined,
        "No global HighchartsAdapter variable."
    );

    assert.strictEqual(
        window.Highcharts,
        undefined,
        "No global Highcharts variable."
    );

    assert.strictEqual(
        Highcharts.product,
        'Highcharts',
        'Highcharts is loaded.'
    );
    // @todo test which version of adapter is running.
    // assert.strictEqual(
    //     H.adapter,
    //     'Standalone Adapter',
    //     'This Highcharts version runs the standalone adapter.'
    // );
});

QUnit.test("Highcharts in use with the jQuery adapter.", function (assert) {
    var Highcharts = require('../../../../js/highcharts.src')(jQuery);
    
    var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container2'
            },
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        });

    assert.strictEqual(
        window.HighchartsAdapter,
        undefined,
        "No global HighchartsAdapter variable."
    );

    assert.strictEqual(
        window.Highcharts,
        undefined,
        "No global Highcharts variable."
    );

    assert.strictEqual(
        Highcharts.product,
        'Highcharts',
        'Highcharts is loaded.'
    );

    // @todo test which version of adapter is running.
    // assert.strictEqual(
    //     H.adapter,
    //     undefined,
    //     'This Highcharts version runs the jQuery adapter.'
    // );
});

QUnit.test("Highcharts in use with modules.", function (assert) {
    var Highcharts = require('../../../../js/highcharts.src');
    var H = new Highcharts(jQuery);
    // Annotations
    require('../../../../js/modules/annotations.src')(H);
    assert.strictEqual(
        !!H.Chart.prototype.annotations,
        true,
        "Annotations is loaded."
    );
    // Boost
    require('../../../../js/modules/boost.src')(H);
    assert.strictEqual(
        typeof H.Series.prototype.getContext,
        'function',
        "Boost is loaded."
    );
    // Broken Axis
    require('../../../../js/modules/broken-axis.src')(H);
    assert.strictEqual(
        !!H.Series.prototype.drawBreaks,
        true,
        "Broken Axis is loaded."
    );
    // Data
    require('../../../../js/modules/data.src')(H);
    assert.strictEqual(
        !!H.Data,
        true,
        "Data is loaded."
    );
    // Drilldown
    require('../../../../js/modules/drilldown.src')(H);
    assert.strictEqual(
        !!H.Point.prototype.doDrilldown,
        true,
        "Drilldown is loaded."
    );
    // Exporting
    require('../../../../js/modules/exporting.src')(H);
    assert.strictEqual(
        !!H.getOptions().exporting,
        true,
        "Exporting is loaded."
    );
    // Funnel
    require('../../../../js/modules/funnel.src')(H);
    assert.strictEqual(
        !!H.seriesTypes.funnel,
        true,
        "Funnel is loaded."
    );
    // Heatmap
    require('../../../../js/modules/heatmap.src')(H);
    assert.strictEqual(
        !!H.seriesTypes.heatmap,
        true,
        "Heatmap is loaded."
    );
    // Map Parser
    require('../../../../js/modules/map-parser.src')(H);
    assert.strictEqual(
        !!H.Data.prototype.loadSVG,
        true,
        "Map Parser is loaded."
    );
    // Map
    require('../../../../js/modules/map.src')(H);
    assert.strictEqual(
        !!H.seriesTypes.map,
        true,
        "Map is loaded."
    );
    // No Data To Display
    require('../../../../js/modules/no-data-to-display.src')(H);
    assert.strictEqual(
        !!H.Series.prototype.hasData,
        true,
        "No Data To Display is loaded."
    );
    // Offline Exporting
    require('../../../../js/modules/offline-exporting.src')(H);
    assert.strictEqual(
        !!H.Chart.prototype.exportChartLocal,
        true,
        "Offline Exporting is loaded."
    );
    // Series Label
    require('../../../../js/modules/series-label.src')(H);
    assert.strictEqual(
        !!H.Series.prototype.checkClearPoint,
        true,
        "Series Label is loaded."
    );
    // Solid Gauge
    require('../../../../js/modules/solid-gauge.src')(H);
    assert.strictEqual(
        !!H.seriesTypes.solidgauge,
        true,
        "Solid Gauge is loaded."
    );
    // Treemap
    require('../../../../js/modules/treemap.src')(H);
    assert.strictEqual(
        !!H.seriesTypes.treemap,
        true,
        "Treemap is loaded."
    );
});
