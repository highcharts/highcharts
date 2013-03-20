$(function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        
        xAxis: {
            categories: ['Green', 'Pink']
        },
        
        series: [{
            data: [{
                name: 'Point 1',
                color: '#00FF00',
                y: 1
            }, {
                name: 'Point 2',
                color: '#FF00FF',
                y: 5
            }]
        }]
    });
});