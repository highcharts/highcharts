$(function () {

    QUnit.test('Stock chart with empty data initially', function (assert) {
        var chart;

        function setData() {
            // generate an array of random data
            var data = [],
                time = new Date().getTime();

            for (var i = -9999; i <= 0; i += 1) {
                data.push([
                    time + i * 10000,
                    i
                ]);
            }
            chart.series[0].setData(data);
        }

        $('#container').highcharts('StockChart', {
            rangeSelector: {
                inputEnabled: false,
                buttons: [{
                    type: 'day',
                    count: 1,
                    text: '1d'
                }, {
                    type: 'hour',
                    count: 12,
                    text: '12h'
                }, {
                    type: 'hour',
                    count: 6,
                    text: '6h'
                }],
                selected: 2
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            xAxis: {
                type: 'datetime'
            },
            series: [{}]
        });
        chart = $('#container').highcharts();

        assert.strictEqual(
            typeof chart.rangeSelector.group,
            'undefined',
            'No range selector group initially'
        );

        // Now add some data
        setData();
        assert.strictEqual(
            typeof chart.rangeSelector.group,
            'object',
            'Range selector group added afgter adding data'
        );


    });
});