QUnit.test('Missing plotband when range is small (#4964)', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: {
            min: 1452666442250,
            max: 1453899392750,
            type: 'datetime',
            plotBands: [{
                color: "#BDBDBD",
                from: 1453101708000,
                to: 1453109508000
            }, {
                color: "red",
                from: 1453726531000,
                to: 1453728606000
            }]
        },
        series: [{
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].plotLinesAndBands[1].svgElem.d.split(' ')[1] !==
            chart.xAxis[0].plotLinesAndBands[1].svgElem.d.split(' ')[6],
        true,
        'Second plotband is visible'
    );
});
QUnit.test('Plot bands on added axis should be exported (#5082)', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            height: 300
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        yAxis: {
            title: {
                text: 'Temperature'
            },
            lineWidth: 2,
            lineColor: '#F33',
            id: 'temperature-axis'
        },

        series: [{
            name: 'Temperature',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            color: '#F33'
        }]
    });

    assert.strictEqual(
        chart.yAxis.length,
        1,
        'Chart has one Y axis'
    );

    // Add secondary yAxis
    chart.addAxis({
        id: 'rainfall-axis',
        title: {
            text: 'Rainfall'
        },
        lineWidth: 2,
        lineColor: '#08F',
        opposite: true
    });

    // Add a plot band to it
    chart.yAxis[1].addPlotBand({
        color: '#abcdef',
        from: 12,
        to: 25
    });

    // ... and a series
    chart.addSeries({
        name: 'Rainfall',
        type: 'column',
        color: '#08F',
        yAxis: 'rainfall-axis',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    });

    // Export it
    $('#output').html(chart.getSVG());

    assert.strictEqual(
        $('#output path[fill="#abcdef"]').length,
        1,
        'Correctly filled path is present in the export'
    );
});

QUnit.test('Defaults', assert => {
    const chart = Highcharts.chart('container', {

        title: {
            text: 'Sensible defaults'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

            plotLines: [{
                value: 5.5
            }]
        },

        yAxis: {
            plotBands: [{
                from: 100,
                to: 120
            }]
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].plotLinesAndBands[0].svgElem.element
            .getAttribute('stroke-width'),
        '1',
        'A default stroke width should be applied to the plot line'
    );
    assert.ok(
        /^#[0-9a-f]{6}$/.test(
            chart.xAxis[0].plotLinesAndBands[0].svgElem.element
                .getAttribute('stroke')
        ),
        'A default stroke color should be applied to the plot line'
    );

    assert.ok(
        /^#[0-9a-f]{6}$/.test(
            chart.yAxis[0].plotLinesAndBands[0].svgElem.element
                .getAttribute('fill')
        ),
        'A default fill color should be applied to the plot band'
    );
});

QUnit.test('General tests', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            plotBands: [{ // mark the weekend
                color: '#FCFFC5',
                from: 3,
                to: 5,
                zIndex: 10,
                borderWidth: 3,
                borderColor: "black"
            }]
        },

        yAxis: {
            plotLines: [{
                value: 12500,
                className: 'my-custom-class',
                width: 2,
                color: 'red'
            }]
        },
        series: [{
            data: [2900.9, 701.5, 10006.4, 12009.2, 1404.0, 1076.0, 135.6, 148.5, 21006.4]
        }]
    });


    assert.notEqual(
        chart.yAxis[0].plotLinesAndBands[0].svgElem.element
            .getAttribute('class')
            .indexOf('my-custom-class'),
        -1,
        'Class name should be applied to plot lines (#8415)'
    );

    var line = chart.xAxis[0].plotLinesAndBands[0].svgElem.d.split(' ');

    assert.strictEqual(
        line[line.length - 1],
        'z',
        'Border should be rendered around the shape (#5909)'
    );

    // Radial Axes plot lines
    var plotLineValue = 27,
        innerRadiusPx = 50,
        axis, plotLine, bBox, center, end, start, plotLineLength;

    chart = Highcharts.chart('container', {
        chart: {
            type: 'solidgauge'
        },
        title: null,
        pane: {
            center: ['50%', '50%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
                innerRadius: '43%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        yAxis: {
            min: 0,
            max: 200,
            lineWidth: 0,
            minorTickInterval: null,
            plotLines: [{
                color: '#268FDD',
                width: 2,
                value: plotLineValue,
                zIndex: 5
            }]
        },
        series: [{
            innerRadius: '43%',
            data: [80]
        }]
    });

    axis = chart.yAxis[0];
    plotLine = axis.plotLinesAndBands[0];
    bBox = plotLine.svgElem.getBBox();
    center = chart.pane[0].center;
    end = axis.getPosition(plotLineValue);
    start = {
        x: center[0] + chart.plotLeft,
        y: center[1] + chart.plotTop
    };
    plotLineLength =
        Math.sqrt(Math.pow(bBox.width, 2) + Math.pow(bBox.height, 2));

    assert.equal(
        (0.57 * Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))).toFixed(3),
        plotLineLength.toFixed(3),
        'RadialAxis plotLine should be plotted from inner to outer radius (percentage radius).'
    );

    chart.update({
        pane: {
            background: {
                innerRadius: innerRadiusPx
            }
        }
    });

    plotLine = chart.yAxis[0].plotLinesAndBands[0];
    bBox = plotLine.svgElem.getBBox();
    plotLineLength =
            Math.sqrt(Math.pow(bBox.width, 2) + Math.pow(bBox.height, 2));

    assert.equal(
        (Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) - innerRadiusPx).toFixed(3),
        plotLineLength.toFixed(3),
        'RadialAxis plotLine should be plotted from inner to outer radius (pixel radius).'
    );
});

QUnit.test('#6433 - axis.update leaves empty plotbands\' groups', function (assert) {
    var chart = new Highcharts.chart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            plotBands: [{
                from: 0.5,
                to: 1,
                color: 'red'
            }]
        },
        series: [{
            data: [10, 20]
        }]
    });

    chart.xAxis[0].update({});
    chart.xAxis[0].update({});

    assert.strictEqual(
        document.getElementsByClassName('highcharts-plot-bands-0').length,
        1,
        'Just one plotband group'
    );
});

QUnit.test('#7709 - From and to infinity', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: {
            plotBands: [{
                color: '#FCFFC5',
                from: -Infinity,
                to: Date.UTC(2010, 0, 3)
            }, {
                color: '#FCFFC5',
                from: Date.UTC(2010, 0, 7),
                to: Infinity
            }],
            tickInterval: 24 * 3600 * 1000, // one day
            type: 'datetime'
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
            pointStart: Date.UTC(2010, 0, 1),
            pointInterval: 24 * 3600 * 1000
        }]
    });

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-plot-band').length,
        2,
        'Two plot bands should be created'
    );
});

QUnit.test('#6521 - missing labels for narrow bands', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            animation: false,
            width: 600
        },
        xAxis: {
            showEmpty: true,
            min: Date.UTC(2016, 0, 13),
            max: Date.UTC(2016, 0, 27),
            type: 'datetime',
            plotBands: [{
                color: "#BDBDBD",
                from: Date.UTC(2016, 0, 18, 4),
                to: Date.UTC(2016, 0, 18, 4, 20),
                label: {
                    rotation: 90,
                    text: 'Wide Enough'
                }
            }, {
                color: "red",
                from: Date.UTC(2016, 0, 25, 8),
                to: Date.UTC(2016, 0, 25, 8),
                label: {
                    rotation: 90,
                    text: 'Too Narrow'
                }
            }]
        },
        series: [{}]
    });

    assert.strictEqual(
        chart.xAxis[0].plotLinesAndBands[0].label.element.textContent,
        'Wide Enough',
        'First label set'
    );
    assert.strictEqual(
        chart.xAxis[0].plotLinesAndBands[1].label.element.textContent,
        'Too Narrow',
        'Second label set'
    );

    chart.xAxis[0].setExtremes(null, Date.UTC(2016, 0, 20));
    assert.strictEqual(
        chart.xAxis[0].plotLinesAndBands[1].label.attr('visibility'),
        'hidden',
        'Outside range, label hidden'
    );

    chart.xAxis[0].setExtremes(null, Date.UTC(2016, 0, 30));
    assert.notEqual(
        chart.xAxis[0].plotLinesAndBands[1].label.attr('visibility'),
        'hidden',
        'Inside range, label shown'
    );
});

// Highcharts 4.0.4, Issue #2361
// X axis plot bands disappear when zooming in
QUnit.test('Plotbands clip (#2361)', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: {
            minRange: 1,
            plotBands: [{
                color: '#FCFFC5',
                from: 1,
                to: 3,
                label: {
                    text: "I will dissapear if you zoom in <br/>so the start of the band isn't visible"
                }
            }]
        },
        yAxis: {
            gridLineWidth: 0
        },

        series: [{
            type: "column",
            data: [1, 2, 3, 4, 5, 6],
            pointPlacement: "between"
        }]
    });
    assert.notEqual(
        chart.xAxis[0].plotLinesAndBands[0].label,
        null,
        "Plotbands should be visible after zooming "
    );
    $('#container').highcharts().xAxis[0].setExtremes(2, 5);

    assert.notEqual(
        chart.xAxis[0].plotLinesAndBands[0].label,
        null,
        "Plotbands should be visible after zooming"
    );
    $('#container').highcharts().xAxis[0].setExtremes(4, 5);
    assert.equal(
        chart.xAxis[0].plotLinesAndBands[0].label.visibility,
        'hidden',
        "Plotbands should be hidden after zooming"
    );
});


QUnit.test('#8356: support for plot lines & bands labels formatter.', function (assert) {
    var plotLine,
        plotBand,
        formatterCallback = function () {
            return 'Label is visible.';
        },
        chart = Highcharts.chart('container', {
            xAxis: {
                plotLines: [{
                    value: 1,
                    color: '#f00',
                    width: 1,
                    label: {
                        formatter: formatterCallback
                    }
                }],
                plotBands: [{
                    from: 2,
                    to: 5,
                    color: 'rgba(255, 255, 0, 0.2)',
                    width: 1,
                    label: {
                        formatter: formatterCallback
                    }
                }]
            },
            series: [{
                data: [1, 2, 6, 1, 2, 4, 9]
            }]
        });

    plotLine = chart.xAxis[0].plotLinesAndBands[0];
    plotBand =  chart.xAxis[0].plotLinesAndBands[1];

    assert.ok(
        plotLine.label &&
          plotLine.label.element.textContent.indexOf(formatterCallback()) > -1,
        "Plot line label is visible."
    );

    assert.ok(
        plotBand.label &&
          plotBand.label.element.textContent.indexOf(formatterCallback()) > -1,
        "Plot band label is visible."
    );

});
