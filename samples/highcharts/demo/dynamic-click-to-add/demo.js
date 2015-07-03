$(function () {
    $('#container').highcharts({
        chart: {
            type: 'scatter',
            margin: [70, 50, 60, 80],
            events: {
                click: function (e) {
                    // find the clicked values and the series
                    var x = e.xAxis[0].value,
                        y = e.yAxis[0].value,
                        series = this.series[0];

                    // Add it
                    series.addPoint([x, y]);

                }
            }
        },
        title: {
            text: 'User supplied data'
        },
        subtitle: {
            text: 'Click the plot area to add a point. Click a point to remove it.'
        },
        xAxis: {
            gridLineWidth: 1,
            minPadding: 0.2,
            maxPadding: 0.2,
            maxZoom: 60
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            minPadding: 0.2,
            maxPadding: 0.2,
            maxZoom: 60,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        plotOptions: {
            series: {
                lineWidth: 1,
                point: {
                    events: {
                        'click': function () {
                            if (this.series.data.length > 1) {
                                this.remove();
                            }
                        }
                    }
                }
            }
        },
        series: [{
            data: [[20, 20], [80, 80]]
        }]
    });
});