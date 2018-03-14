
Highcharts.chart('container', {
    chart: {
        type: 'column'
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
