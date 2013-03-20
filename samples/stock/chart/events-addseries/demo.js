$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container',
        	events: {
            	addSeries: function() {
                	alert ('A series was added');
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
