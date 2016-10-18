$(function () {

    QUnit.test('Stock chart with overshooting range', function (assert) {
        var chart,
            i;


        var eps = [{
            x: Date.UTC(2005, 11, 31, 12, 0, 0, 0),
            y: 15.3
        }, {
            x: Date.UTC(2015, 11, 31, 12, 0, 0, 0),
            y: 41.95
        }];

        var buttons = [];
        for (i = 11; i > 6; i--) {
            buttons.push({
                type: "year",
                count: i,
                text: i + "y"
            });
        }

        $('#container').highcharts('StockChart', {
            rangeSelector: {
                buttons: buttons
                //allButtonsEnabled: true //or false - doesn't matter
            },
            xAxis: {
                minRange: 1
            },
            series: [{
                name: "EPS",
                data: eps
            }]
        });
        chart = $('#container').highcharts();

        assert.strictEqual(
            chart.xAxis[0].max,
            Date.UTC(2015, 11, 31, 12, 0, 0, 0),
            'Initially valid maximum'
        );


        chart.rangeSelector.clickButton(2);
        assert.strictEqual(
            chart.xAxis[0].max,
            Date.UTC(2015, 11, 31, 12, 0, 0, 0),
            'Valid maximum for 9 years'
        );

        chart.rangeSelector.clickButton(1);
        assert.strictEqual(
            chart.xAxis[0].max,
            Date.UTC(2015, 11, 31, 12, 0, 0, 0),
            'Valid maximum for full range'
        );


    });
});