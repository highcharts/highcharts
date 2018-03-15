
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    plotOptions: {
        series: {
            colorByPoint: true,
            dataLabels: {
                enabled: true,
                format: '{point.y:.1f}',
                inside: true
            }
        }
    },

    yAxis: {
        max: 10,
        allowDecimals: false
    },

    title: {
        text: 'Live Data (CSV)'
    },

    subtitle: {
        text: 'Data input from a remote, changing, CSV file'
    },

    data: {
        csvURL: 'https://demo-live-data.highcharts.com/updating-set.csv',
        enablePolling: true
    }
});
