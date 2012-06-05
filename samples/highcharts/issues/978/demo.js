$(function() {
    var chart = new Highcharts.Chart({

	    chart: {
	        renderTo: 'container'
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