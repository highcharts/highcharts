QUnit.test('Data label alignment and x/y options (#13580)', assert => {

    const chart = Highcharts.chart('container', {
        chart: {
            width: 300,
            height: 300,
            plotBorderWidth: 1
        },
        yAxis: {
            max: 2000
        },
        series: [{
            data: [1000],
            dataLabels: {
                enabled: true,
                backgroundColor: 'black'
            },
            type: 'column',
            animation: false
        }]
    });

    const label = chart.series[0].points[0].dataLabel;

    const testAlignment = (align, verticalAlign) => {
        chart.series[0].update({
            dataLabels: {
                align,
                verticalAlign,
                x: -1000,
                y: -1000
            }
        });
        assert.close(
            label.translateX,
            0,
            1,
            `The label should be X justified left (${align}, ${verticalAlign})`
        );

        chart.series[0].update({
            dataLabels: {
                x: 1000,
                y: 1000
            }
        });
        assert.close(
            label.translateX + label.getBBox().width,
            chart.plotWidth,
            1,
            `The label should be X justified right (${align}, ${verticalAlign})`
        );
    };

    assert.ok(
        chart.isInsidePlot(label.translateX, label.translateY),
        'Start position should be inside the plot'
    );

    testAlignment('left', 'top');
    testAlignment('center', 'middle');
    testAlignment('right', 'bottom');
});