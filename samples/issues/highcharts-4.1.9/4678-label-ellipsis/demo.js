
$(function () {
    QUnit.test("Ellipsis should be reset after zoom", function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'bar',
                zoomType: 'x',
                animation: false
            },

            xAxis: {
                categories: [
                    'Jan Jan Jan ',
                    'Feb Feb Feb ',
                    'Mar Mar Mar Mar Mar Mar Mar Mar Mar Mar Mar Mar ',
                    'Apr Apr Apr Apr Apr Apr Apr Apr Apr Apr Apr Apr ',
                    'May May May May May May May May May May May May ',
                    'Jun Jun Jun Jun Jun Jun Jun Jun Jun Jun Jun Jun ',
                    'Jul Jul Jul Jul Jul Jul Jul Jul Jul Jul Jul Jul ',
                    'Aug Aug Aug Aug Aug Aug Aug Aug Aug Aug Aug Aug ',
                    'Sep Sep Sep Sep Sep Sep Sep Sep Sep Sep Sep Sep ',
                    'Oct Oct Oct Oct Oct Oct Oct Oct Oct Oct Oct Oct ',
                    'Nov Nov Nov Nov Nov Nov Nov Nov Nov Nov Nov Nov ',
                    'Dec Dec Dec Dec Dec Dec Dec Dec Dec Dec Dec Dec '
                ],
                labels: {
                    style: {
                        fontFamily: 'monospace'
                    }
                }
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        }).highcharts();

        assert.strictEqual(
            typeof chart.xAxis[0].ticks[0].label.getBBox().height,
            'number',
            'Sanity check'
        );
        assert.strictEqual(
            chart.xAxis[0].ticks[0].label.getBBox().height,
            chart.xAxis[0].ticks[11].label.getBBox().height,
            'Same height labels'
        );

        // Zoom in
        chart.xAxis[0].setExtremes(0, 5);
        assert.strictEqual(
            chart.xAxis[0].ticks[11],
            undefined,
            'Last tick is gone'
        );

        // Zoom out
        chart.xAxis[0].setExtremes();
        assert.strictEqual(
            chart.xAxis[0].ticks[0].label.getBBox().height,
            chart.xAxis[0].ticks[11].label.getBBox().height,
            'Same height labels'
        );


    });

    QUnit.test('#5034: No ellipsis for multiline labels where there is room', function (assert) {
        var chart = Highcharts.chart('container', {

            chart: {
                "type": "bar"
            },
            xAxis: {
                "categories": ["Cat1", "Cat2 bla bla bla bla bla bla bla bla bla bla", "Cat3 bla bla bla bla bla bla bla"]
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

        assert.ok(
            chart.xAxis[0].ticks[1].label.getBBox().height > chart.xAxis[0].ticks[0].label.getBBox().height,
            'Second label is multiple lines'
        );

        assert.strictEqual(
            chart.xAxis[0].ticks[1].label.getBBox().height,
            chart.xAxis[0].ticks[2].label.getBBox().height,
            'Third label is same as second'
        );
    });
});