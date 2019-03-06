QUnit.test('#10137: Datalables\'s positions after justification.', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 400,
            height: 400
        },
        xAxis: {
            minPadding: 0.1,
            maxPadding: 0.1
        },
        series: [{
            data: [{
                y: 1,
                dataLabels: {
                    x: -50
                }
            }, {
                y: -1,
                dataLabels: {
                    y: 50
                }
            }, {
                y: 3,
                dataLabels: {
                    y: -50
                }
            }, {
                y: 2,
                dataLabels: {
                    x: 50
                }
            }],
            type: 'scatter',
            colorByPoint: true,
            dataLabels: {
                enabled: true,
                defer: false, // disable initial animation
                borderWidth: 1,
                borderColor: '#000',
                backgroundColor: '#fff',
                align: 'center',
                verticalAlign: 'middle'
            }
        }]
    });

    // Function which checks whether the data labels are aligned to plot
    // area edges. Return true if data labels are aligned.
    var checkDLAlign = function () {
        // Extreme data labels
        var dl = {
            left: chart.series[0].points[0].dataLabel,
            bottom: chart.series[0].points[1].dataLabel,
            top: chart.series[0].points[2].dataLabel,
            right: chart.series[0].points[3].dataLabel
        };

        var align = (
            // Left
            Math.round(dl.left.absoluteBox.x) === chart.plotLeft &&
            // Bottom
            Math.round(dl.bottom.absoluteBox.y +
                dl.bottom.absoluteBox.height) === chart.plotTop +
                    chart.plotHeight &&
            // Top
            Math.round(dl.top.absoluteBox.y) === chart.plotTop &&
            // Right
            Math.round(dl.right.absoluteBox.x +
                dl.right.absoluteBox.width) === chart.plotLeft +
                    chart.plotWidth
        );
        return align;
    };

    // Check whether data labels are aligned to plot area edges on every
    // align setup.
    ['left', 'center', 'right'].forEach(function (align) {
        chart.series[0].update({
            dataLabels: {
                align: align
            }
        });

        assert.strictEqual(
            checkDLAlign(),
            true,
            'Data labels are aligned to plot area edges, when align: ' +
            align + ' is set.'
        );
    });

    // Check whether data labels are aligned to plot area edges on every
    // align setup.
    ['top', 'middle', 'bottom'].forEach(function (verticalAlign) {
        chart.series[0].update({
            dataLabels: {
                verticalAlign: verticalAlign
            }
        });

        assert.strictEqual(
            checkDLAlign(),
            true,
            'Data labels are aligned to plot area edges, when verticalAlign: ' +
            verticalAlign + ' is set.'
        );
    });
});
