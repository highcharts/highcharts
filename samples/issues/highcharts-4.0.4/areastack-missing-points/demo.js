$(function () {
	$('#container').highcharts({

	    chart: {
	        type: 'area'
	    },

	    title: {
	    	text: 'Lower series is missing a data point. Upper series should fall down.'
	    },
	    
	    plotOptions: {
	        series: {
	            stacking: 'normal'
	        }
	    },            
	    
	    xAxis: {
	        type: 'category'    
	    },

	    series: [{
	        data: [
	            [0, 1],
	            [1, 1],
	            [2, 1],
	            [3, 1],
	            [4, 1]             
	        ]
	    }, {
	        data: [
	            [0, 1],
	            [1, 1],
	            //[2, 1],
	            [3, 1],
	            [4, 1]             
	        ]
	    }]

	});
});
