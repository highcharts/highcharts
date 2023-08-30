Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Highest buildings in Oslo (2023)',
        align: 'left'
    },
    subtitle: {
        text:
            'Source: <a target="_blank" ' +
            'href="https://no.wikipedia.org/wiki/Liste_over_h%C3%B8ye_bygninger_i_Norge">wiki</a>',
        align: 'left'
    },
    xAxis: {
        crosshair: true,
        categories: ['Oslo plaza', 'Posthuset', 'Uranienborg kirke', 'Orkla city'],
        accessibility: {
            description: 'Buildings'
        }
    },
    legend: {
        enabled: false
    },
    yAxis: {
        title: {
            text: 'Height (m)'
        }
    },
    tooltip: {
        valueSuffix: ' (m)'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [
        {
            data: [109.7, 108.1, 72.4, 66.7],
            type: 'column',
            label: {
                enabled: false
            }
        }
    ]
});
