/* eslint-env node*/

// Run the tests without jQuery
var jQueryParked = window.jQuery;

function removeJQuery() {
    delete window.jQuery;
    delete window.$;
}
function addJQuery() {
    window.jQuery = window.$ = jQueryParked;
}

QUnit.test("Highcharts", function (assert) {
    removeJQuery();

    var Highcharts = require('../../../../js/highcharts.src'),
        chart = new Highcharts.Chart({
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
            plotOptions: {
                dataLabels: {
                    enabled: true
                }
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
    addJQuery();
});

QUnit.test("Highcharts More", function (assert) {
    removeJQuery();

    var Highcharts = require('../../../../js/highcharts.src');
    require('../../../../js/highcharts-more.src')(Highcharts);

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

    assert.strictEqual(
        typeof Highcharts.seriesTypes.gauge,
        'function',
        'Gauge is present.'
    );

    // Solid Gauge
    require('../../../../js/modules/solid-gauge.src')(Highcharts);
    assert.strictEqual(
        typeof Highcharts.seriesTypes.solidgauge,
        'function',
        "Solid Gauge is loaded."
    );

    addJQuery();
});

QUnit.test("Highstock", function (assert) {
    removeJQuery();

    var Highcharts = require('../../../../js/highstock.src');

    var chart = new Highcharts.StockChart({
        chart: {
            renderTo: 'container-stock'
        },
        xAxis: {
            breaks: [{
                from: Date.UTC(2015, 6, 3),
                to: Date.UTC(2015, 7, 6)
            }]
        },
        series : [{
            name : 'AAPL',
            data : Highcharts.map(new Array(365), function (undef, i) { 
                return i;
            }),
            pointStart: Date.UTC(2015, 0, 1),
            pointInterval: 24 * 36e5,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });

    assert.ok(
        chart.series[0].points.length > 300,
        "Stock chart is generated"
    );

    assert.strictEqual(
        typeof chart.xAxis[0].breakArray,
        'object',
        "Breaks are handled"
    );

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
        'Highstock',
        'Highstock is loaded.'
    );

    addJQuery();
});

QUnit.test("Highmaps", function (assert) {
    removeJQuery();

    var Highcharts = require('../../../../js/highmaps.src');
    Highcharts.maps["countries/us/us-all"] = require('./us-all');
    jQueryParked.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=us-population-density.json&callback=?', function (data) {
        // Make codes uppercase to match the map data
        jQuery.each(data, function () {
            this.code = this.code.toUpperCase();
        });
        // Instanciate the map
        Highcharts.Map({
            chart : {
                renderTo: 'container-map',
                borderWidth : 1
            },
            title : {
                text : 'US population density (/km²)'
            },
            legend: {
                layout: 'horizontal',
                borderWidth: 0,
                backgroundColor: 'rgba(255,255,255,0.85)',
                floating: true,
                verticalAlign: 'top',
                y: 25
            },
            mapNavigation: {
                enabled: true
            },
            colorAxis: {
                min: 1,
                type: 'logarithmic',
                minColor: '#EEEEFF',
                maxColor: '#000022',
                stops: [
                    [0, '#EFEFFF'],
                    [0.67, '#4444FF'],
                    [1, '#000022']
                ]
            },
            series : [{
                animation: {
                    duration: 1000
                },
                data : data,
                mapData: Highcharts.maps['countries/us/us-all'],
                joinBy: ['postal-code', 'code'],
                dataLabels: {
                    enabled: true,
                    color: 'white',
                    format: '{point.code}'
                },
                name: 'Population density',
                tooltip: {
                    pointFormat: '{point.code}: {point.value}/km²'
                }
            }]
        });
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
        'Highmaps',
        'Highmaps is loaded.'
    );

    addJQuery();
});

QUnit.test("Highcharts in use with modules", function (assert) {

    removeJQuery();

    var Highcharts = require('../../../../js/highcharts.src');
    // Annotations
    require('../../../../js/modules/annotations.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.Chart.prototype.annotations,
        true,
        "Annotations is loaded."
    );
    // Boost
    require('../../../../js/modules/boost.src')(Highcharts);
    assert.strictEqual(
        typeof Highcharts.Series.prototype.getContext,
        'function',
        "Boost is loaded."
    );
    // Broken Axis
    require('../../../../js/modules/broken-axis.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.Series.prototype.drawBreaks,
        true,
        "Broken Axis is loaded."
    );
    // Data
    require('../../../../js/modules/data.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.Data,
        true,
        "Data is loaded."
    );
    // Drilldown
    require('../../../../js/modules/drilldown.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.Point.prototype.doDrilldown,
        true,
        "Drilldown is loaded."
    );
    // Exporting
    require('../../../../js/modules/exporting.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.getOptions().exporting,
        true,
        "Exporting is loaded."
    );
    // Funnel
    require('../../../../js/modules/funnel.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.seriesTypes.funnel,
        true,
        "Funnel is loaded."
    );
    // Heatmap
    require('../../../../js/modules/heatmap.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.seriesTypes.heatmap,
        true,
        "Heatmap is loaded."
    );
    // Map Parser
    require('../../../../js/modules/map-parser.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.Data.prototype.loadSVG,
        true,
        "Map Parser is loaded."
    );
    // Map
    require('../../../../js/modules/map.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.seriesTypes.map,
        true,
        "Map is loaded."
    );
    // No Data To Display
    require('../../../../js/modules/no-data-to-display.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.Series.prototype.hasData,
        true,
        "No Data To Display is loaded."
    );
    // Offline Exporting
    require('../../../../js/modules/offline-exporting.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.Chart.prototype.exportChartLocal,
        true,
        "Offline Exporting is loaded."
    );
    // Series Label
    require('../../../../js/modules/series-label.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.Series.prototype.checkClearPoint,
        true,
        "Series Label is loaded."
    );
    // Treemap
    require('../../../../js/modules/treemap.src')(Highcharts);
    assert.strictEqual(
        !!Highcharts.seriesTypes.treemap,
        true,
        "Treemap is loaded."
    );

    addJQuery();
});

