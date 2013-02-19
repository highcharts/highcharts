$(function() {
	var chart = $('#container').highcharts('StockChart', {

	    rangeSelector: {
	    	selected: 1
	    },

	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	}, null, true);

	// the button handler
	var isLoading = false,
	    $button = $('#button');
	$button.click(function() {
	    if (!isLoading) {
	        chart.showLoading();
	        $button.html('Hide loading');
		} else {
	    	chart.hideLoading();
	    	$button.html('Show loading');
	    }
	    isLoading = !isLoading;
	});
});