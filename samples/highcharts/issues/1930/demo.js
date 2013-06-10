$(function () {
	var chart = new Highcharts.Chart({

	    chart: {
	        renderTo: 'container',
	        type: 'arearange',
	        inverted: true
	    },
	    
	    xAxis: {
	        type: 'category'
	    },
	    
	    yAxis: {
	        minTickInterval: 1
	    },

	    series: [{
	        data: [
	            ['Ein', 1, 2],
	            ['To', 2, 3],
	            ['Tre', 3, 4]
	        ]
	    }]

	});
});