$(function () {

    // Create random data
    var data = [];
    for (var i=0; i < 100; i++) {
        data.push([
            Math.floor(Math.random()*10),
            Math.floor(Math.random()*10),
            Math.floor(Math.random()*10)
        ]);
    }

    Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.4,
                cy: 0.3,
                r: 0.5
            },
            stops: [
                [0, '#FFFFFF'],
                [1, color]
            ]
        };
    });

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
                viewDistance: 5,

                frame: {
                    bottom: { size: 1, color: '#E0E0E0' },
                    back: { size: 1, color: '#E0E0E0' },
                    side: { size: 1, color: '#E0E0E0' },
                }
            }
        },
        title: {
            text: 'Draggable box'
        },
        subtitle: {
            text: 'Click and drag the plot area to rotate in space'
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

    Highcharts.addEvent(chart.container, 'mousedown', function (e) {          
        // Normalize for cross browser support
        e = chart.pointer.normalize(e);

        var posX = e.chartX,
            posY = e.chartY;

        $(document).bind({
            'mousemove.line': function (e) {
                var alpha = chart.options.chart.options3d.alpha,
                    beta = chart.options.chart.options3d.beta;

                // Test beta
                if ((e.pageX - posX) > 5) {
                    beta = Math.min(90, beta - 1);
                } else if ((e.pageX - posX) < -5) {
                    beta = Math.max(0, beta + 1);
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
    });
    
});