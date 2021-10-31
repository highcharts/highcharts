Highcharts.chart('container', {
    title: {
        text: 'Custom number format for Y axis labels'
    },

    subtitle: {
        text: 'Add a unit and force two decimals'
    },

    yAxis: {
        labels: {
            format: '${value:.2f}'
        }
    },

    series: [
        {
            data: [
                29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
                194.1, 95.6, 54.4
            ],
            type: 'column'
        }
    ]
});
