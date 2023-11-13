QUnit.test('problem should not be', function (assert) {
    assert.expect(0);
    const chart = Highcharts.ganttChart('container', {
        // "legend": {
        //     "enabled": true
        // },
        title: {
            text: 'Schedule Gantt'
        },
        yAxis: [{
            scrollbar: {
                enabled: true
            }
            // "uniqueNames": true,
            // "labels": {
            //     "useHTML": true,
            //     "style": {
            //         "width": "250px",
            //         "textOverflow": "ellipsis"
            //     }
            // }
        }],
        xAxis: [{
            min: 1663718400000,
            max: 1665014400000
        }],
        chart: {
            type: 'gantt'
        },
        series: [{
            name: 'main',
            // "tooltip": {
            //     "headerFormat": undefined
            // },
            data: [{
                name: '{"name":"Project e"}',
                id: '_kROSzePBRRiMxe7RK6tl-Q',
                start: 1664496000000,
                end: 1665014400000,
                duration: 7,
                startsBefore: false,
                endsAfter: false
            }, {
                name: '{"name":"Project e"}',
                id: '_kROSzePBRRiMxe7RK6tl-Q',
                start: 1663718400000,
                startsBefore: false,
                endsAfter: false,
                milestone: true
            }]
        }]
    });

    const [series] = chart.series;

    try {
        series.hide();
    } catch (e) {
        assert.ok(false, 'Hiding the series should not throw an error');
        series.show();
    }

    // const [ point ] = series.points;
    //
    // try {
    //     // Trigger mouse over
    //     point.onMouseOver();
    // } catch(e) {
    //     assert.ok(false, 'Hovering over the point should not throw an error');
    // }

});
