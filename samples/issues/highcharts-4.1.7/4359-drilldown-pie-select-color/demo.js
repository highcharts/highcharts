$(function () {
    //Highcharts.seriesTypes.pie.prototype.animateDrilldown = function() {}; // disable animation for drilldown

    QUnit.test('Slice color after drilldown and select.', function (assert) {
        var options = {
                chart: {
                    type: 'pie',
                    options3d: {
                        alpha: 45,
                        beta: 0
                    }
                },
                plotOptions: {
                    pie: {
                        depth: 35,
                        allowPointSelect: true,
                        colors: ['#00e500', '#004400']
                    }

                },
                series: [{
                    name: "Materials",
                    data: [{
                        y: 23.73
                    }, {
                        y: 76.27,
                        drilldown: "Recycled Materials"
                    }]
                }],
                drilldown: {
                    series: [{
                        animation: false,
                        id: "Recycled Materials",
                        data: [
                            ["Tent Frames and Chairs - 6,400 lbs", 4.35],
                            ["Aluminum Cans - 28,950 lbs", 19.66],
                            ["Plastic PET Bottles - 36,420 lbs", 24.73],
                            ["Glass - 40,950 lbs", 27.8],
                            ["Cardboard - 30,000 lbs", 20.37],
                            ["Solo Cups - 4,556 lbs", 3.09] ]
                    }]
                }
            },
            chart, chart3d;

        chart = $('#container').highcharts(options).highcharts();
        options.chart.options3d.enabled = true;
        chart3d = $('#container_2').highcharts(options).highcharts();

        chart.series[0].points[1].doDrilldown();
        chart.series[0].points[0].select();

        chart3d.series[0].points[1].doDrilldown();
        chart3d.series[0].points[0].select();

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr("fill"),
            chart.series[0].options.colors[0],
            'Proper select-state color'
        );

        assert.strictEqual(
            chart3d.series[0].points[0].graphic.top.attr("fill"),
            chart3d.series[0].options.colors[0],
            'Proper select-state color'
        );
    });
});