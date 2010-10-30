$(function(){ // on dom ready

    var chart = new Highcharts.Chart({
        
		chart: {
            renderTo: 'container',
            //alignTicks: false,
            defaultSeriesType: 'line'
        },
		
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
		
        yAxis: [{
            title: {
                text: 'Primary Axis'
            },
            gridLineWidth: 0
        }, {
            title: {
                text: 'Secondary Axis'
            },
            opposite: true
        }],
		
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        
        }, {
            data: [129.9, 271.5, 306.4, 29.2, 544.0, 376.0, 435.6, 348.5, 216.4, 294.1, 35.6, 354.4],
            yAxis: 1
        
        }]
    });
    
});
