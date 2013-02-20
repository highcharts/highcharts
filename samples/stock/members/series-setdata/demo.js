$(function() {
	var chart = $('#container').highcharts('StockChart', {

	    rangeSelector: {
	    	selected: 1
	    },

	    series: [{
	        name: 'MSFT',
	        data: MSFT
	    }]
	}, null, true);

	$('#button').click(function() {
		chart.series[0].setData(ADBE);
		this.disabled = true;
	});
});