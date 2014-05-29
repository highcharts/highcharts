$(function () {
    	
	$('#container').highcharts({
		chart: {
	        type: 'pie'
	    },
	    title: {
	    	text: 'Test for pie charts in highstock.js'
	    },
	    subtitle: {
	    	text: 'If you can see the pie with no<br/>JS errors, the test has passed'
	    },
	    series: [{
            data: [1,2,3,4,5,6]
	    }]
	
	});
    
});