$(function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        
        plotOptions: {
            series: {
                minPointLength: 3
            }
        },
        
        series: [{
            data: [3, 4, 6, 0.01, -0.01, -2, -4, 0, 1, 6, 3, 2]
        }]
    });
});