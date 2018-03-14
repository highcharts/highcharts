
Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Live Data (CSV)'
    },

    subtitle: {
        text: 'Data input from a remote CSV file'
    },

    data: {
        csvURL: 'https://demo-live-data.highcharts.com/time-data.csv',
        enablePolling: true
    }
});
