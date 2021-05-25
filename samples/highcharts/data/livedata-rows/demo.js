Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },

    title: {
        text: 'Live Data (Rows JSON)'
    },

    subtitle: {
        text: 'Data input from a remote JSON file'
    },

    legend: {
        enabled: false
    },

    yAxis: {
        title: null
    },

    data: {
        rowsURL: 'https://demo-live-data.highcharts.com/time-rows.json',
        firstRowAsNames: false,
        enablePolling: true,
        name: 'Random Sample Data'
    }
});
