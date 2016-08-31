$(function () {
    QUnit.test('Crosshair on multiple axes', function (assert) {
        var chart = Highcharts.chart('container', {
            yAxis: [{
                id: 'primary',
                crosshair: true
            }, {
                id: 'secondary',
                crosshair: true,
                opposite: true

            }],
            tooltip: {
                shared: true
            },
            plotOptions: {
                series: {
                    kdNow: true
                }
            },
            series: [{
                data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7]
            }, {
                yAxis: 1,
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }]
        });

        chart.renderTo.style.position = 'absolute';
        chart.renderTo.style.top = 0;
        chart.renderTo.style.left = 0;


        chart.series[0].points[0].onMouseOver();
        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: 300,
            pageY: 300,
            target: chart.container
        });

        assert.strictEqual(
            chart.yAxis[0].cross.element.nodeName,
            'path',
            'Primary axis has cross'
        );

        assert.strictEqual(
            chart.yAxis[1].cross.element.nodeName,
            'path',
            'Secondary axis has cross'
        );

        chart.renderTo.style.position = 'static';
    });

    QUnit.test('Crosshair with snap false (#5066)', function (assert) {
        var chart = Highcharts.chart('container', {

            xAxis: {
                crosshair: {
                    snap: false
                }
            },

            yAxis: {
                crosshair: {
                    snap: false
                }
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                type: 'column'
            }]

        });

        chart.renderTo.style.position = 'absolute';
        chart.renderTo.style.top = 0;
        chart.renderTo.style.left = 0;


        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: 100,
            pageY: 100,
            target: chart.container
        });

        assert.strictEqual(
            chart.xAxis[0].cross.element.nodeName,
            'path',
            'X axis has cross'
        );

        assert.strictEqual(
            chart.yAxis[0].cross.element.nodeName,
            'path',
            'Y axis has cross'
        );

        chart.renderTo.style.position = 'static';
    });
});