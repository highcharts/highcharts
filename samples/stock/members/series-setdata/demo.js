$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'MSFT',
	        data: MSFT
	    }]
	});
	
	$('#button').click(function() {
		chart.series[0].setData(ADBE);
		this.disabled = true;
	});
});