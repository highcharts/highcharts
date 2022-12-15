// Highcharts 4.0.4, Issue #3648
// Datalabel position is incorrect for data points when using multiple yAxis
QUnit.test('Wrong datalabel position (#3648)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            inverted: true
        },
        accessibility: {
            enabled: false // A11y module adds DOM elements => different childNodes in container
        },
        yAxis: [
            {
                width: 200,
                lineWidth: 2
            },
            {
                left: 250,
                width: 200,
                offset: 0,
                lineWidth: 2
            }
        ],
        plotOptions: {
            series: {
                animation: false,
                dataLabels: {
                    enabled: true,
                    inside: true,
                    style: {
                        fontWeight: 'bold',
                        color: 'red'
                    },
                    format: '{series.name} - {y}'
                }
            }
        },
        series: [
            {
                data: [11, 12, 13, 14]
            },
            {
                data: [21, 22, 23, 24],
                yAxis: 1
            }
        ]
    });
    var pointsFirstSeries = chart.series[0].points,
        pointsSecondSeries = chart.series[1].points,
        heightOfFirstSeries = chart.container.childNodes[0].childNodes[4]
            .getBBox().height,
        xPosForDataLabels = [],
        columnHeights = [];

    for (var i = 0; i < pointsFirstSeries.length; i++) {
        columnHeights.push(pointsFirstSeries[i].graphic.getBBox().height);
        xPosForDataLabels.push(pointsFirstSeries[i].dataLabel.x);
    }

    // Return false if a value of the first array is lower
    // than the corresponding value of the second array
    function compareValuesOfTwoArrays(arr1, arr2) {
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] < arr2[i]) {
                return false;
            }
        }
        return true;
    }

    assert.ok(
        compareValuesOfTwoArrays(columnHeights, xPosForDataLabels),
        'The position of the datalabels for the first series is incorrect'
    );

    xPosForDataLabels = [];
    columnHeights = [];
    // Adding the first series container height to the columnHeights and
    // xPosForDataLabels for the second series
    for (var j = 0; j < pointsSecondSeries.length; j++) {
        columnHeights.push(
            heightOfFirstSeries + pointsSecondSeries[j].graphic.getBBox().height
        );
        xPosForDataLabels.push(
            heightOfFirstSeries + pointsSecondSeries[j].dataLabel.x
        );
    }

    assert.ok(
        compareValuesOfTwoArrays(columnHeights, xPosForDataLabels),
        'The position of the datalabels for the second series is incorrect'
    );
});

// Highcharts 4.0.4, Issue #3648
// The tooltip positions is incorrect for data points when using multiple yAxis
QUnit.test('Wrong datalabel position (#3648)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            inverted: true
        },

        yAxis: [
            {
                width: 200,
                lineWidth: 2
            },
            {
                left: 250,
                width: 200,
                offset: 0,
                lineWidth: 2
            }
        ],
        series: [
            {
                data: [5]
            },
            {
                data: [21],
                yAxis: 1
            }
        ]
    });
    var controller = new TestController(chart),
        firstSeries = chart.series[0].points[0],
        secondSeries = chart.series[1].points[0],
        plotLeft = chart.plotLeft,
        firstSeriesCenterX = firstSeries.plotX,
        firstSeriesColumnX = firstSeries.graphic.getBBox().height + plotLeft,
        firstSeriesWidth = chart.series[0].yAxis.len,
        seriesCenterY = chart.plotHeight / 2 + chart.plotTop,
        secondSeriesCenterX = secondSeries.plotX + firstSeriesWidth,
        secondSeriesColumnX =
            secondSeries.graphic.getBBox().height + plotLeft + firstSeriesWidth;

    controller.mouseOver(firstSeriesCenterX, seriesCenterY);

    assert.notOk(chart.tooltip.isHidden, 'Tooltip is hidden');

    var tooltipXPos = chart.tooltip.now.x;

    assert.ok(
        firstSeriesColumnX < tooltipXPos && secondSeriesColumnX > tooltipXPos,
        'The position of the tooltip is wrong'
    );

    controller.mouseOver(secondSeriesCenterX, seriesCenterY);
    tooltipXPos = chart.tooltip.now.x;
    assert.ok(
        secondSeriesColumnX < tooltipXPos,
        'The position of the tooltip is wrong'
    );
});
