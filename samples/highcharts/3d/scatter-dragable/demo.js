$(function () {
    var data = [];
    for (var i=0; i < 100; i++) {
        data.push([
            Math.floor(Math.random()*10),
            Math.floor(Math.random()*10),
            Math.floor(Math.random()*10)
            ]);
    }

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            margin: 100,
            type: 'scatter',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 30,
                depth: 250,

                frame: {
                    bottom: { size: 1, color: '#909090' },
                    back: { size: 1, color: '#909090' },
                    side: { size: 1, color: '#909090' },
                }
            }
        },
        plotOptions: {
            scatter: {
                width: 10,
                height: 10,
                depth: 10
            }
        },
        yAxis: {
            //opposite: true,
            min: 0,
            max: 10
        },
        xAxis: {
            min: 0,
            max: 10,
            gridLineWidth: 1,

        },
        zAxis: {
            min: 0,
            max: 10
        },
        series: [{
            colorByPoint: true,
            data: data
        }]
    });

    chart.seriesGroup.element.parentElement.onmousedown = function (e) {          
        var line = this,
            posX = e.pageX
            posY = e.pageY;
        $(document).bind({
            'mousemove.line': function (e) {
                var alpha = chart.options.chart.options3d.alpha,
                    beta = chart.options.chart.options3d.beta;

                // Test beta
                if ((e.pageX - posX) > 5) {
                    beta = Math.min(90, beta+1);
                } else if ((e.pageX - posX) < -5) {
                    beta = Math.max(0, beta-1);
                }
                posX = e.pageX;
                chart.options.chart.options3d.beta = beta;

                // Test alpha
                if ((e.pageY - posY) > 5) {
                    alpha = Math.min(90, alpha+1);
                } else if ((e.pageY - posY) < -5) {
                    alpha = Math.max(0, alpha-1);
                }
                posY = e.pageY;
                chart.options.chart.options3d.alpha = alpha;

                chart.redraw(false);
            },                            
            'mouseup.line': function () { 
                $(document).unbind('.line');
            },
        });
    };
    
});