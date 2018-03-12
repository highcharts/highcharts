
Highcharts.chart('container', {
    chart: {
        type: 'spline',
        height: 800
    },
    title: {
        text: 'Live Data (Columns JSON)'
    },

    subtitle: {
        text: 'Data input from a remote JSON file'
    },

    data: {
        columnsURL: 'https://s3-eu-west-1.amazonaws.com/demo-live-data.highcharts.com/time-cols.json',
        enablePolling: true
    }
});
