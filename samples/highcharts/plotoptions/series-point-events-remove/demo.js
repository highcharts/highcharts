const chart = Highcharts.chart('container', {
    plotOptions: {
        series: {
            point: {
                events: {
                    remove: () => {
                        if (!confirm(
                            'Do you really want to remove the first ' +
                            'point?'
                        )) {
                            return false;
                        }
                    }
                }
            }
        }
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});

document.getElementById('button').addEventListener('click', () => {
    const series = chart.series[0];
    if (series.data.length) {
        chart.series[0].data[0].remove();
    }
});
