$(function () {
    
    var chart = new Highcharts.Chart({
    
        chart: {
            renderTo: 'container',
            type: 'gauge'
        },
        
        pane: {
            startAngle: -150,
            endAngle: 150
        },     
        
        yAxis: {
            min: 0,
            max: 100,
            plotBands: [{
                from: 0,
                to: 60,
                color: '#89A54E',
                innerRadius: '100%',
                outerRadius: '105%'
            }]
        },                  
        
        series: [{
            data: [80]
        }]
    
    });
});