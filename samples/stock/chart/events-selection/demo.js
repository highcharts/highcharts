$(function() {
	var $report = $('#report');
	
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container',
	        zoomType: 'x',
	        events: {
	        	selection: function(event) {
	                if (event.xAxis) {
	                    $report.html('Last selection:<br/>min: '+ Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].min) +
	                    	', max: '+ Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].max));
	                } else {
	                    $report.html ('Selection reset');
	                }
	        	}
	        }
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	});
});