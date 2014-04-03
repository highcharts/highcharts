$(function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column',
            margin: 75,
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25
            }
        },
        title: {
            text: 'Chart rotation demo'
        },
        subtitle: {
            text: 'Test options by dragging the sliders below'
        },
        plotOptions: {
            column: {
                depth: 25
            }
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
    $('#R0').on('change', function(){
        chart.options.chart.options3d.alpha = this.value;
        chart.redraw(false);
    });
    $('#R1').on('change', function(){
        chart.options.chart.options3d.beta = this.value;
        chart.redraw(false);
    });
    $('#R2').on('change', function() {
        chart.options.chart.options3d.depth = this.value;
        chart.redraw(false);
    });
    $('#R3').on('change', function() {
        chart.options.chart.options3d.viewDistance = this.value;
        chart.redraw(false);
    });
});