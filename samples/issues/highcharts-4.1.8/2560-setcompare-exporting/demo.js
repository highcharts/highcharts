$(function () {
    QUnit.test("SetCompare method", function (assert) {
        var chart = $('#container').highcharts('StockChart',{
            plotOptions: {
                series: {
                    pointInterval: 24 * 3600 * 1000,
                    compare: 'value'
                }
            },
            xAxis:{
                tickInterval: 24 * 3600 * 1000
            },
            series: [{
                data:[2,4,-5,6,3,2,1]
            },{
                data:[4,3,2,-1,2,3,4]
            },{
                data:[4,4,4,5,-6,3,3]
            }]
        }).highcharts();

        var defaultCompare = chart.series[0].options.compare,
            endCompare;

        chart.yAxis[0].setCompare('percent');

        endCompare = chart.series[0].options.compare;

        assert.strictEqual(
            defaultCompare !== endCompare,
            true,
            'Correct compare value'
        );

        
        
    });

});