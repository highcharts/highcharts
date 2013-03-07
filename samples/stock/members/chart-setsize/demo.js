$(function() {
	
	var container = $('#container')[0];
	$('#resizer').resizable({
	    // On resize, set the chart size to that of the 
	    // resizer minus padding. If your chart has a lot of data or other
	    // content, the redrawing might be slow. In that case, we recommend 
	    // that you use the 'stop' event instead of 'resize'.
	    resize: function() {
	        chart.setSize(
	            this.offsetWidth - 20, 
	            this.offsetHeight - 20,
	            false
	        );
	    }
	});
	
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
});