
Highcharts.chart('container', {
    chart: {
        type: 'spline',
        height: 800
    },
    title: {
        text: 'Live Data (CSV)'
    },

    subtitle: {
        text: 'Data input from a remote CSV file'
    },

    data: {
        csvURL: 'https://demo-live-data.highcharts.com/sine-data.csv',
        enablePolling: true
    }
});
