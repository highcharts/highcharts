$(function () {
    QUnit.test('Plot band labels outside plot area', function (assert) {
        var chart,
            options = {
                chart: {
                    width: 600
                },
                xAxis: {
                    plotBands: [{
                        from: 5,
                        to: 6,
                        color: Highcharts.getOptions().colors[0],
                        label: {
                            text: 'Before'
                        }
                    }, {
                        from: 12,
                        to: 13,
                        color: Highcharts.getOptions().colors[2],
                        label: {
                            text: 'Within'
                        }
                    }, {
                        from: 25,
                        to: 26,
                        color: Highcharts.getOptions().colors[3],
                        label: {
                            text: 'After'
                        }

                    }]
                },

                series: [{
                    data: [1, 2, 3, 4, 5, 6, 7],
                    pointStart: 10
                }]
            };

        // Create the Highcharts chart
        chart = $('#container').highcharts(options).highcharts();

        assert.equal(
            typeof chart.xAxis[0].plotLinesAndBands[0].label,     
            'undefined',
            'Highcharts - before'
        );
        assert.equal(
            typeof chart.xAxis[0].plotLinesAndBands[1].label,     
            'object',
            'Highcharts - within'
        );
        assert.equal(
            typeof chart.xAxis[0].plotLinesAndBands[2].label,     
            'undefined',
            'Highcharts - after'
        );

        // Create the Highstock chart
        chart = $('#container').highcharts('StockChart', options).highcharts();

        assert.equal(
            typeof chart.xAxis[0].plotLinesAndBands[0].label,     
            'undefined',
            'Highcharts - before'
        );
        assert.equal(
            typeof chart.xAxis[0].plotLinesAndBands[1].label,     
            'object',
            'Highcharts - within'
        );
        assert.equal(
            typeof chart.xAxis[0].plotLinesAndBands[2].label,     
            'undefined',
            'Highcharts - after'
        );
    });

});