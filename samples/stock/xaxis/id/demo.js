$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	    },
	    
	    xAxis: {
	    	id: 'x-axis'
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	});
	
	// the button action
	$('#button').click(function() {
    	alert('The axis object: '+ chart.get('x-axis'));
	});
});