Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: '5 Foods High in Vitamin A'
    },

    subtitle: {
        text: 'Source: <a href="https://www.healthline.com/nutrition/foods-high-in-vitamin-a" target="_blank">healthline</a>'
    },
    yAxis: {
        title: {
            text: 'Vitamin A in microgram'
        },
        labels: {
            format: '{text} mcg'
        }
    },
    tooltip: {
        useHTML: true,
        headerFormat: '<table><tr><th colspan="2">{point.key} (100gr)</th></tr>',
        pointFormat: '<tr><td>{series.name}: </td>' +
            '<td style="text-align: right"><b>{point.y} mcg</b></td></tr>',
        footerFormat: '</table>'
    },
    data: {
        csv: document.getElementById('csv').innerHTML
    },

    plotOptions: {
        series: {
            marker: {
                enabled: false
            },
            dataLabels: {
                enabled: true,
                format: '{y} mcg'
            }
        }
    }
});