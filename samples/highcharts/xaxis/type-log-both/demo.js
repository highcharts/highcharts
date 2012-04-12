$(function () {
    var chart = new Highcharts.Chart({
    
        chart: {
            renderTo: 'container',
            width: 400,
            height: 400,
            spacingRight: 20
        },
    
        xAxis: {
            type: 'logarithmic',
            min: 1,
            max: 1000,
            endOnTick: true,
            tickInterval: 1,
            minorTickInterval: 0.1,
            gridLineWidth: 1
        },
        
        yAxis: {
            type: 'logarithmic',
            min: 1,
            max: 1000,
            tickInterval: 1,
            minorTickInterval: 0.1,
            title: {
                text: null
            }
        },
        
        legend: {
            enabled: false
        },
    
        series: [{
            data: (function() {
                var data = [];
                for (var i = 0; i < 100; i++) {
                    data.push([
                        1 + Math.random() * 999, 
                        1 + Math.random() * 999
                    ]);
                }
                return data;
            })(),
            type: 'scatter'
        }]
    
    });
});