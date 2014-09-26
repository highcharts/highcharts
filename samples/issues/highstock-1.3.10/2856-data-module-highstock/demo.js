$(function () {
    // Create the chart
    $('#container').highcharts('StockChart',{


        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        data: {
            googleSpreadsheetKey: '0Am-0HKnuNa4MdDNTNS1FYnd6ZDA3R0NvN29yYnVoZFE',
            googleSpreadsheetWorksheet: 2
        },

    });
});