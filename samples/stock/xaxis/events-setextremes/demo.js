$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	    },
	    
	    xAxis: {
	    	events: {
	    		setExtremes: function(e) {
	    			$('#report').html('<b>Set extremes:</b> '+ Highcharts.dateFormat(null, e.min) +
	    				', '+ Highcharts.dateFormat(null, e.max));
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