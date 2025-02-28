Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },

    title: {
        text: 'Live Data (CSV)'
    },

    xAxis: {
        tickPixelInterval: 150
    },

    subtitle: {
        text: 'Data input from a remote CSV file'
    },

    data: {
        csvURL: 'https://demo-live-data.highcharts.com/time-data.csv',
        enablePolling: true
    }
});
