
Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },

    title: {
        text: 'Live Data (Columns JSON)'
    },

    subtitle: {
        text: 'Data input from a remote JSON file'
    },

    data: {
        columnsURL: 'https://demo-live-data.highcharts.com/time-cols.json',
        firstRowAsNames: false,
        enablePolling: true
    }
});
