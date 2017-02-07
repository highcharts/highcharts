
var chart = Highcharts.stockChart('container', {

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]

});

// the button handler
var isLoading = false,
    $button = $('#button');
$button.click(function () {
    if (!isLoading) {
        chart.showLoading();
        $button.html('Hide loading');
    } else {
        chart.hideLoading();
        $button.html('Show loading');
    }
    isLoading = !isLoading;
});
