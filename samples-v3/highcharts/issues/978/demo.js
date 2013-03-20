$(function() {
    $('#container').highcharts({

	    chart: {
	    },
	
	    yAxis: {
	        type: 'logarithmic',
	        min: 1
	    },
	
	    series: [{
	        data: [null, null, null]
	    }]
	
	});
});