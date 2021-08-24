// Create the chart
Highcharts.chart('container', {

    title: {
        text: 'Highcharts data from Google Spreadsheets'
    },

    data: {
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '0AoIaUO7wH1HwdENPcGVEVkxfUDJkMmFBcXMzOVVPdHc',
        error: console.error
    }

});