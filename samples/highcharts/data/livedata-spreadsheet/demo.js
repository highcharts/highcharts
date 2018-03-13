
Highcharts.chart('container', {
    chart: {
        type: 'spline',
        height: 800
    },
    title: {
        text: 'Live Data (Google Spreadsheets)'
    },

    subtitle: {
        text: 'Data input from a remote spreadsheet w/polling'
    },

    data: {
        googleSpreadsheetKey: '1zulHoZgTE8tFDfZ1I-Ngwd-czpuMOZrFnKoBPy87abg',
        enablePolling: true
    }
});
