QUnit.test('Ordinal general tests.', function (assert) {
    var chart = Highcharts.stockChart('container', {
            chart: {
                width: 500
            },
            yAxis: {
                opposite: false
            },
            xAxis: {
                min: 1458054620689
            },
            series: [
                {
                    type: 'column',
                    data: [
                        [1451577600000, 305899579],
                        [1454256000000, 303016703],
                        [1456761600000, 308008429],
                        [1459440000000, 328699625],
                        [1462032000000, 350010305],
                        [1464710400000, 365809905],
                        [1467302400000, 364839585],
                        [1469980800000, 386193804],
                        [1472659200000, 387630083],
                        [1475251200000, 405138911]
                    ]
                }
            ]
        }),
        tickPositions = chart.xAxis[0].tickPositions;

    assert.ok(
        tickPositions[0] >= chart.xAxis[0].min,
        'First tick should be greater than axis min when ' +
            'ordinal is enabled (#12716).'
    );

    chart.update({
        xAxis: {
            min: 1451577600000,
            max: 1472316189645.8,
            reversed: true
        },
        yAxis: {
            reversed: true
        }
    });

    tickPositions = chart.xAxis[0].tickPositions;

    assert.ok(
        tickPositions[tickPositions.length - 1] <= chart.xAxis[0].max,
        'Last tick should be smaller than axis max when ' +
            'ordinal is enabled (#12716).'
    );
});

QUnit.test(
    '#1011 - Artifacts in top left corner when usign ' +
        'ordinal axis and ignoreHiddenSeries.',
    function (assert) {
        var chart = new Highcharts.StockChart({
                chart: {
                    renderTo: 'container',
                    ignoreHiddenSeries: false
                },
                rangeSelector: {
                    selected: 1
                },
                legend: {
                    enabled: true
                },
                series: [
                    {
                        data: usdeur
                    },
                    {
                        data: usdeur
                    }
                ]
            }),
            initialTicks = chart.xAxis[0].tickPositions.slice(),
            hiddenTicks;

        chart.series[0].hide();
        chart.series[1].hide();

        hiddenTicks = chart.xAxis[0].tickPositions;

        assert.deepEqual(initialTicks, hiddenTicks, 'The same tick positions.');
    }
);

QUnit.test('Ordinal axis and lazy loading', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            events: {
                afterSetExtremes: function () {
                    this.chart.series[0].setData([
                        [883612800000, 3.41],
                        [886291200000, 4.62],
                        [1314835200000, 385.03],
                        [1317427200000, 379.96]
                    ]);
                }
            },
            minRange: 3600 * 1000 // one hour
        },
        navigator: {
            adaptToUpdatedData: false,
            series: {
                data: [
                    [883612800000, 0],
                    [1317427200000, 1]
                ]
            }
        },
        series: [
            {
                type: 'area',
                data: [
                    [1318618860000, 421.37],
                    [1318618980000, 421.45],
                    [1318619040000, 421.45],
                    [1318619100000, 421.31],
                    [1318619160000, 421.32],
                    [1318622040000, 421.88],
                    [1318622100000, 421.95],
                    [1318622160000, 421.98],
                    [1318622220000, 421.95],
                    [1318622340000, 422]
                ]
            }
        ]
    });

    chart.rangeSelector.clickButton(5, true);

    Highcharts.objectEach(chart.xAxis[0].ticks, tick => {
        assert.strictEqual(
            tick.isNew,
            false,
            'Tick ' + tick.label.textStr + ' rendered (#10290)'
        );
    });
});


QUnit.test('Panning ordinal axis on mobile devices- lin2val calculation, #13238', function (assert) {
    const data = [
            [1585594800000, 1137.26],
            [1585594860000, 1139.22],
            [1585594920000, 1140.09],
            [1585594980000, 1139.08],
            [1585595040000, 1139.92],
            [1585595100000, 1139.23],
            [1585595160000, 1139.34],
            [1585595220000, 1137.27],
            [1585595280000, 1138.01],
            [1585595340000, 1139.13],
            [1585595400000, 1140.52],
            [1585595460000, 1141.56],
            [1585595520000, 1142.36],
            [1585595580000, 1141.86],
            [1585595640000, 1142.11],
            [1585595700000, 1140.96],
            [1585595760000, 1141.22],
            [1585595820000, 1139.62],
            [1585595880000, 1139.66],
            [1585595940000, 1141.1],
            [1585596000000, 1141.99],
            [1585596060000, 1142.02],
            [1585596120000, 1141.65],
            [1585596180000, 1140.78],
            [1585596240000, 1138.25],
            [1585596300000, 1136.84],
            [1585596360000, 1139.32],
            [1585596420000, 1135.75],
            [1585596480000, 1137.34],
            [1585596540000, 1137.14],
            [1585596600000, 1138.5],
            [1585596660000, 1138.17],
            [1585596720000, 1138.18],
            [1585596780000, 1138.58],
            [1585596840000, 1140.13],
            [1585596900000, 1140.42],
            [1585596960000, 1143.71],
            [1585597020000, 1143.35],
            [1585597080000, 1146.68],
            [1585597140000, 1147.99],
            [1585597200000, 1147.79],
            [1585597260000, 1146.26],
            [1585597320000, 1145.26],
            [1585597380000, 1143.22],
            [1585597440000, 1145.41],
            [1585597500000, 1146.13],
            [1585597560000, 1143.72],
            [1585597620000, 1144.19],
            [1585597680000, 1144.27],
            [1585597740000, 1141.3],
            [1585597800000, 1142.95],
            [1585597860000, 1142.01],
            [1585597920000, 1142.31],
            [1585597980000, 1139.55],
            [1585598040000, 1148.34],
            [1585598100000, 1148.68],
            [1585598160000, 1149.42],
            [1585665060000, 1166.27],
            [1585665120000, 1166.62],
            [1585665180000, 1164.2],
            [1585665240000, 1162.72],
            [1585665300000, 1164.65],
            [1585665360000, 1167.25],
            [1585665420000, 1167.98],
            [1585665480000, 1170.69],
            [1585665540000, 1170.62],
            [1585665600000, 1172.5],
            [1585665660000, 1171.71],
            [1585665720000, 1168.99],
            [1585665780000, 1169.2],
            [1585665840000, 1168.31],
            [1585665900000, 1167.06],
            [1585665960000, 1167.42],
            [1585666020000, 1169.32],
            [1585666080000, 1168.55],
            [1585666140000, 1168.49],
            [1585666200000, 1170.46],
            [1585666260000, 1171.11]
        ],
        chart = Highcharts.stockChart('container', {
            chart: {
                width: 500
            },
            xAxis: {
                min: 1585595880000
            },
            series: [{
                data: data
            }]
        }),
        axis = chart.xAxis[0];

    function emulatePanning() {
        const newMin = axis.toValue(-20),
            newMax = axis.toValue(400);

        chart.xAxis[0].setExtremes(newMin, newMax);
    }

    emulatePanning();

    assert.ok(
        axis.min > chart.series[0].points[0].x,
        `After panning 20px, the axis extremes should not be reset
        but changed respectively.`
    );
});

QUnit.test('findIndexOf', assert => {
    const findIndexOf =
        // eslint-disable-next-line no-underscore-dangle
        Highcharts._modules['Core/Axis/OrdinalAxis.js'].Composition.findIndexOf;
    const array = [0, 1, 3, 5, 10, 12, 13, 15];
    assert.equal(findIndexOf(array, 3), 2);
    assert.equal(findIndexOf(array, 0), 0);
    assert.equal(findIndexOf(array, 14), -1);
    assert.equal(findIndexOf(array, 18), -1);
    assert.equal(findIndexOf(array, 3, true), 2);
    assert.equal(findIndexOf(array, 0, true), 0);
    assert.equal(findIndexOf(array, -10, true), 0);
    assert.equal(findIndexOf(array, 2, true), 2);
    assert.equal(findIndexOf(array, 11, true), 4);
    assert.equal(findIndexOf(array, 18, true), 7);
});


QUnit.test('lin2val- unit test for values outside the plotArea.', function (assert) {
    const axis = {
        transA: -0.04,
        min: 3,
        len: 500,
        translationSlope: 0.2,
        ordinal: {
            extendedOrdinalPositions: [0, 0.5, 1.5, 3, 4.2, 4.8, 5, 7, 8, 9],
            positions: [3, 4.2, 4.8, 5, 7],
            slope: 500
        },
        series: [{
            points: [{
                x: 3,
                plotX: -20
            }, {
                x: 4.2,
                plotX: 80 // distance between points 100px
            }]
        }]
    };
    axis.ordinal.axis = axis;

    // On the chart there are 5 points equaly spaced.
    // The distance between them equals 100px.
    // Thare are some points that are out of the current range.
    // The last visible point is located at 380px.
    // EOP = extendedOrdinalPositions

    axis.ordinal.getIndexOfPoint =
        // eslint-disable-next-line no-underscore-dangle
        Highcharts._modules['Core/Axis/OrdinalAxis.js'].Composition.prototype.getIndexOfPoint;
    axis.ordinal.findIndexOf =
        // eslint-disable-next-line no-underscore-dangle
        Highcharts._modules['Core/Axis/OrdinalAxis.js'].Composition.prototype.findIndexOf;
    function lin2val(val) {
        return Highcharts.Axis.prototype.lin2val.call(axis, val);
    }

    assert.strictEqual(
        lin2val(-20 / axis.transA + axis.min),
        3,
        `For the pixel value equal to the first point x position,
        the function should return the value for that point.`
    );
    assert.strictEqual(
        lin2val(80 / axis.transA + axis.min),
        4.2,
        `For the pixel value equal to the second point x position,
        the function should return the value for that point.`
    );
    assert.strictEqual(
        lin2val(30 / axis.transA + axis.min),
        3.6,
        `For the pixel value located between two visible points,
        the function should calculate the value between them.`
    );
    assert.strictEqual(
        lin2val(-50 / axis.transA + axis.min),
        2.55,
        `For the pixel value smaller than the first visible point, the function
        should calculate value between that point and next using EOP array.`
    );
    assert.strictEqual(
        lin2val(-520 / axis.transA + axis.min),
        -2,
        `For the pixel value lower than any point in EOP array, the function
        should calculate an approximate value based on previous distance.`
    );
    assert.strictEqual(
        lin2val(380 / axis.transA + axis.min),
        7,
        `For the pixel value equal to last point, 
        the function should return the value for that point.`
    );
    assert.strictEqual(
        lin2val(420 / axis.transA + axis.min),
        7.4,
        `For the pixel value higher than the first visible point, the function
        should calculate value between that point and next using EOP array.`
    );
    assert.strictEqual(
        lin2val(1000 / axis.transA + axis.min),
        12.2,
        `For the pixel value higher than any point in extendedOrdinalPositions,
        array, the function should calculate value for that point.`
    );
});
