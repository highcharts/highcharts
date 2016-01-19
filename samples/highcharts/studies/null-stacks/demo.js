$(function () {
    $('#container').highcharts({
        
        chart: {
            type: 'areaspline'
        },
        
        plotOptions: {
            series: {
                stacking: 'normal',
                fillOpacity: 0.3,
                _connectNulls: true
            }
        },
        yAxis: {
            //min: -5
        },
        
        series: [{
            data: [1,2,3,4,5,4,3,2,1],
            pointStart: 2
        }, {
            data: [1,2,null,2,1,1]
        }, {
            data: [1,1,1,1,1,1,1,1,1,1,1,1]
        }]

    });
});
