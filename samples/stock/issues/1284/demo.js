$(function () {
    var chart = new Highcharts.Chart({

	    chart: {
	        renderTo: 'container',
	        type: 'pie'
	    },
	    
	    title: {
	    	text: 'Pie chart on highstock.js'
	    },
	
	    series: [{
	        data: [1,3,2,4]
	    }]
    });
 });