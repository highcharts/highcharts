QUnit.test('Series update', function (assert) {
    let chart = Highcharts.chart('container', {
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
        'Point radius should not be updated after adding series other than ' +
        'packedbubble.'
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

    chart = Highcharts.chart('container', {
        series: [{
            type: 'bar',
            data: [4, 3, 5, 6, 2, 3]
        }],
        xAxis: {
            lineWidth: 0
        }
    });

    chart.series[0].update({
        type: 'packedbubble'
    });

    assert.notEqual(
        chart.inverted,
        true,
        `After updating from bar (inverted) chart to packedbubble (non-inverted)
        chart.inverted option should be updated (#20264).`
    );

    chart.update({
        chart: {
            inverted: true
        }
    });

    assert.strictEqual(
        chart.sharedClips[chart.series[0].sharedClipKey].attr('width'),
        chart.plotWidth,
        `For inverted chart without axes clip box width should be the same as
        chart plot width, #20264.`
    );

    assert.strictEqual(
        chart.sharedClips[chart.series[0].sharedClipKey].attr('height'),
        chart.plotHeight,
        `For inverted chart without axes clip box height should be the same as
        chart plot height, #20264.`
    );
});
