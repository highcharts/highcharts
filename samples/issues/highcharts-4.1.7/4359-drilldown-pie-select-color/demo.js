$(function () {
    Highcharts.seriesTypes.pie.prototype.animateDrilldown = function() {}; // disable animation for drilldown

    QUnit.test('Slice color after drilldown and select.', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'pie'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    colors: ['#00e500', '#004400']
                },

            },
            series: [{
                name: "Materials",
                data: [{
                    y: 23.73,
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
                        ["Solo Cups - 4,556 lbs", 3.09], ]
                }]
            }
        }).highcharts();

        chart.series[0].points[1].doDrilldown();
        chart.series[0].points[0].select();

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr("fill"),
            chart.series[0].options.colors[0],
            'Proper select-state color'
        );
        
    });
});