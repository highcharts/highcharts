QUnit.test('Pie data labels alignTo option', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            plotBorderWidth: 1,
            type: 'pie'
        },
        plotOptions: {
            pie: {
                size: '30%',
                dataLabels: {
                    enabled: true,
                    alignTo: 'plotEdges',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: [{
                name: 'Chrome',
                y: 30
            }, {
                name: 'Chromium',
                y: 10
            }, {
                name: 'IE',
                y: 30
            }, {
                name: 'Firefox',
                y: 20
            }]
        }]
    });

    var series = chart.series[0],
        points = series.points,
        connectorPadding = series.options.dataLabels.connectorPadding,
        point,
        dataLabel,
        translateX,
        width,
        isAlignmnetCorrect = true,
        acceptableDifference = 1, // in px
        leftHalfMaxLabelWidth = 0,
        rightHalfMaxLabelWidth = 0,
        i;


    // alignTo: 'plotEdges'
    for (i = 0; i < points.length && isAlignmnetCorrect; i++) {
        point = points[i];
        dataLabel = point.dataLabel;
        width = dataLabel.getBBox().width;
        translateX = dataLabel.translateX;
        isAlignmnetCorrect = (point.half ?
            Math.abs(translateX - connectorPadding) : Math.abs(chart.plotWidth - translateX - width - connectorPadding)) <= acceptableDifference;
    }
    assert.ok(
        isAlignmnetCorrect,
        "All labels are aligned correctly when alignTo = 'plotEdges'"
    );

    chart.series[0].update({
        dataLabels: {
            alignTo: 'connectors'
        }
    });
    isAlignmnetCorrect = true;
    points = chart.series[0].points;

    // alignTo: 'connectors'
    // find widest data label in each half
    for (i = 0; i < points.length; i++) {
        point = points[i];
        width = point.dataLabel.getBBox().width;
        if (point.half) { // left half
            if (width > leftHalfMaxLabelWidth) {
                leftHalfMaxLabelWidth = width;
            }
        } else {
            if (width > rightHalfMaxLabelWidth) {
                rightHalfMaxLabelWidth = width;
            }
        }
    }

    // check the position of each label
    for (i = 0; i < points.length && isAlignmnetCorrect; i++) {
        point = points[i];
        dataLabel = point.dataLabel;
        width = dataLabel.getBBox().width;
        translateX = dataLabel.translateX;

        isAlignmnetCorrect = (point.half ? Math.abs(leftHalfMaxLabelWidth - translateX - width + connectorPadding) :
            Math.abs(chart.plotWidth - translateX - rightHalfMaxLabelWidth - connectorPadding)) <= acceptableDifference;

    }
    assert.ok(
        isAlignmnetCorrect,
        "All labels are aligned correctly when alignTo = 'connectors'"
    );
});
