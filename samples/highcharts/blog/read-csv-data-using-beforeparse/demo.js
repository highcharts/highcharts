Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'RDA of B1, B2, and B3 for men and women'
    },

    subtitle: {
        text: 'Source: <a href="https://www.ou.org/life/health/vitamins-supplements-need/" target="_blank">ou.org</a>'
    },
    yAxis: {
        title: {
            text: 'Recommended Dietary Allowances'
        },
        labels: {
            format: '{text} mcg',
            step: 3
        }
    },
    tooltip: {
        valueSuffix: ' mg'
    },
    data: {
        csv: document.getElementById('csv').innerHTML,
        beforeParse: function (csv) {
            return csv.replace(/mg/g, '');
        }
    },
    colors: ['#058DC7', '#c7058d'],
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{y} mg'
            }
        }
    }
});