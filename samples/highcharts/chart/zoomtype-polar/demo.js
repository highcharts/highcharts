Highcharts.chart('container', {
    chart: {
        type: 'line',
        zoomType: 'xy',
        polar: true
    },

    data: {
        csv: document.getElementById('data').innerText
    },

    title: {
        text: 'Polar zoom'
    },

    yAxis: {
        lineWidth: 2,
        tickPixelInterval: 50
    },

    legend: {
        enabled: false
    },

    tooltip: {
        valueDecimals: 1,
        valueSuffix: ' ℃'
    },

    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    }
});