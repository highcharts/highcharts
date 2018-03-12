
Highcharts.chart('container', {
    chart: {
        type: 'spline',
        height: 800
    },
    title: {
        text: 'Live Data (Rows JSON)'
    },

    subtitle: {
        text: 'Data input from a remote JSON file'
    },

    data: {
        rowsURL: 'https://s3-eu-west-1.amazonaws.com/demo-live-data.highcharts.com/time-rows.json',
        enablePolling: true
    }
});
