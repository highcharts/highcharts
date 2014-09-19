$(function () {
    $('#container').highcharts({
        chart: {
            events: {
                load: function () {
                    this.setSize(380, 300);
                }
            }
        },
        title: {
            text: 'Issue in 3.0.6 caused orphaned stack labels'
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            data: [100,300,200,400]
        }, {
            data: [300,400,200,500]
        }]

    });
});