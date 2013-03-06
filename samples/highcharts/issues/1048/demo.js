$(function() {
	var w = 1;
	$('#container').highcharts({

	    chart: {
	        plotBorderWidth: w,
	        plotBorderColor: 'red',
	        width: 400
	    },
	    
	    title: {
	        text: 'Test that axis lines cover plotBorder'
	    },
	    
	    subtitle: {
	        text: 'No red lines should be visible close to the plot border'
	    },
	    xAxis: [{
	        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	        lineWidth: w,
	        gridLineWidth: w,
	        gridLineColor: 'red',
	        tickColor: 'red',
	        tickPosition: 'inside'
	    }, {
	        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	        opposite: true,
	        lineWidth: w     
	    }],
	    
	    yAxis: [{
	        lineWidth: w,
	        gridLineColor: 'red'
	    }, {
	        lineWidth: w,
	        opposite: 'true'
	    }],
	    series: [{
	        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
	    }]

	});
});