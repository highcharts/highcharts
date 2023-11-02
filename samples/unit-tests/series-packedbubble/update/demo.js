QUnit.test('Series update', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'packedbubble',
            width: 500,
            height: 500,
            marginTop: 46,
            marginBottom: 53
        },
        series: [
            {
                layoutAlgorithm: {
                    splitSeries: true,
                    parentNodeLimit: true
                },
                data: [50, 80, 50]
            }
        ]
    });
    chart.update({
        series: [
            {
                data: [2, 3, 4, 5, 6, 7]
            }
        ]
    });
    const series = chart.series[0],
        point = series.data[5],
        radius = point.marker.radius;
    assert.strictEqual(
        !series.parentNode.graphic,
        false,
        'parentNode is visible after series.update'
    );
    chart.addSeries({
        type: 'pie',
        data: [1],
        size: '5%'
    });
    assert.strictEqual(
        radius,
        point.radius,
        'Point radius should not be updated after adding series other than packedbubble.'
    );

    chart.series[1].remove(false);
    chart.series[0].setData([], false);

    chart.update({
        chart: {
            width: 400,
            marginTop: 80,
            marginLeft: 50
        }
    });

    ['group', 'markerGroup', 'parentNodesGroup'].forEach(group => {
        assert.strictEqual(
            series[group].translateX,
            chart.plotLeft,
            `Horizontally position of series.${group} should be same as
            chart.plotLeft (#12063).`
        );

        assert.strictEqual(
            series[group].translateY,
            chart.plotTop,
            `Vertically position of series.${group} should be same as
            chart.plotTop (#12063).`
        );
    });
});
