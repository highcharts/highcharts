$(function () {
    QUnit.test('Show-hide linked series', function (assert) {


        $('#container').highcharts({
            series: [{
                id: 'tokyo',
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'Tokyo Bis',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
                linkedTo: 'tokyo',
                visible: false
            },
            {
                id: 'berlin',
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'Berlin Bis',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8],
                linkedTo: 'berlin',
                visible: false
            }]
        });
        var chart = $('#container').highcharts();

        function hide() {
            chart.series[1].setVisible(false, false);
            chart.series[1].setData([-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5], false);
            chart.series[3].setVisible(false, false);
            chart.series[3].setData([3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8], false);
            chart.redraw();
        }
        function show() {
            chart.series[1].setVisible(true, false);
            chart.series[1].setData([-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5], false);
            chart.series[3].setVisible(true, false);
            chart.series[3].setData([3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8], false);
            chart.redraw();
        }

        // This sequence caused crash
        show();
        hide();
        show();

        assert.strictEqual(
            chart.series[1].graph.element.nodeName,
            'path',
            'Series has a path'
        );

    });

});