$(function() {
	var chart = $('#container').highcharts('StockChart', {

	    chart: {
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
	}, null, true);


	// activate the button
	$('#button').click(function() {
	    chart.addSeries({
	    	name: 'ADBE',
	        data: ADBE
	    });

	    $('#button').unbind('click');
	});
});
