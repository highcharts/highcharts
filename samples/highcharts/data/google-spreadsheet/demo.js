// Create the chart
Highcharts.chart('container', {

    title: {
        text: 'Highcharts data from Google Spreadsheets'
    },

    data: {
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw',
        error: console.error
    }

});