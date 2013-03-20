$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	});
	
	$('#button').click(function() {
		var series = chart.series[0];
		if (series.visible) {
			series.hide();
		} else {
			series.show();
		}
	});
});