$(function () {
    QUnit.test('Sum height not exceeding plot area', function (assert) {
        var chart;

        $('#container').highcharts({
            chart: {
                type: 'waterfall'
            },

            title: {
                text: 'Highcharts Waterfall'
            },

            xAxis: {
                type: 'category'
            },

            yAxis: {
                title: {
                    text: 'USD'
                },
                min: 95.638
            },

            legend: {
                enabled: false
            },

            tooltip: {
                pointFormat: '<b>${point.y:,.2f}</b> USD'
            },

            series: [{
                "data": [{
                    "y": 100,
                    "name": "03+09",
                    "color": "#555555"
                }, {
                    "y": 20,
                    "name": "Thing 1"
                }, {
                    "y": 4.5,
                    "name": "Thing 2"
                }, {
                    "y": -9,
                    "name": "Random bad thing"
                }, {
                    "y": -7,
                    "name": "Another thing"
                }, {
                    "y": -3.5,
                    "name": "Misc"
                }, {
                    "isIntermediateSum": true,
                    "name": "IntSum",
                    "color": "#555555"
                }, {
                    "isSum": true,
                    "name": "Sum",
                    "color": "#555555"
                }],
                "dataLabels": {
                    "enabled": true,
                    "style": {
                        "color": "#FFFFFF",
                        "fontWeight": "bold",
                        "textShadow": "0px 0px 3px black"
                    }
                },
                "pointPadding": 0
            }]
        });

        chart = $('#container').highcharts();

        assert.equal(
            chart.series[0].points[6].graphic.attr('y') + chart.series[0].points[6].graphic.attr('height') <=
                chart.yAxis[0].len + 2,
            true,
            'Intermediate sum inside plot area'
        );
        assert.equal(
            chart.series[0].points[7].graphic.attr('y') + chart.series[0].points[7].graphic.attr('height') <=
                chart.yAxis[0].len + 2,
            true,
            'Sum inside plot area'
        );

    });

});