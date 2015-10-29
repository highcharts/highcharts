$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        title: {
            text: "Marker overflow"
        },
        subtitle: {
            text: "Values below 100 should be clipped"
        },

        xAxis: {
            labels: {
                formatter: function () {
                    return this.value;
                }
            }
        },

        yAxis: [{
            height: "40%",
            min: 100,
            max: 200,
            tickInterval: 20,
            startOnTick: false
        }],

        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                    radius: 5
                }
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});