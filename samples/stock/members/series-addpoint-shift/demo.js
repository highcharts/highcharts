$(function() {
	var data = usdeur.splice(0, 500);


	var chart = $('#container').highcharts('StockChart', {

	    rangeSelector: {
	    	selected: 1
	    },

	    series: [{
	        name: 'USD to EUR',
	        data: data
	    }]
	}, null, true);

	$('#button').click(function() {
		var i = 0,
			series = chart.series[0];
		data = usdeur.splice(0, 100);

		for (i; i < data.length; i++) {
			series.addPoint(data[i], false, true);
		}
		chart.redraw();

		if (!usdeur.length) {
			this.disabled = true;
		}
	});
});