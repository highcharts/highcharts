
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
        csvURL: 'https://s3-eu-west-1.amazonaws.com/demo-live-data.highcharts.com/sine-data.csv'
    }
});
