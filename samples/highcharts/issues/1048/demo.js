$(function() {
	Highcharts.setOptions({
	    yAxis: {
	        lineWidth: 2,
	        lineColor: 'red'
	    },
	    xAxis: {
	        lineWidth: 2,
	        lineColor: 'blue'
	    }
	});
	
	var chart = new Highcharts.Chart({
	
	    chart: {
	        renderTo: 'container',
	        width: 400,
	        height: 200
	    },
	    
	    title: {
	    	text: 'Issue #1048: general options on multiple axes'
	    },
	
	    xAxis: [{
	        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	    }],
	
	    series: [{
	        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
	    }]
	
	});
});