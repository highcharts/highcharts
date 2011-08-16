$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container',
        	events: {
            	redraw: function() {
                	alert ('The chart is being redrawn');
            	}
        	} 
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'MSFT',
	        data: MSFT
	    }]
	});
	
		
	// activate the button
	$('#button').click(function() {
	    chart.addSeries({
	    	name: 'ADBE',
	        data: ADBE        
	    });
	
	    $('#button').unbind('click');
	});
});
