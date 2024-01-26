(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        subtitle: {
            text: 'Note: This sample is obsolete as of v9.0, when native browser date pickers were implemented',
            style: {
                color: 'red'
            }
        },

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]

    }, function (chart) {

        // apply the date pickers
        setTimeout(function () {
            $('input.highcharts-range-selector', $(chart.container).parent())
                .datepicker();
        }, 0);
    });

    // Set the datepicker's date format
    $.datepicker.setDefaults({
        dateFormat: 'yy-mm-dd',
        onSelect: function () {
            this.onchange();
            this.onblur();
        }
    });

})();