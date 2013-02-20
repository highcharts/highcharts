$(function() {
	var chart = $('#container').highcharts('StockChart', {

	    chart: {
	    },

	    rangeSelector: {
	    	selected: 1,
			inputBoxStyle: {
				right: '80px'
			}
	    },

	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }],

	    exporting: {
	    	chartOptions: {
	    		chart: {
	    			width: 1024,
	    			height: 768
	    		}
	    	}
	    }
	}, null, true);

	$('#button').click(function() {
		chart.exportChart();
	});
});