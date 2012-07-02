$(function () {
    
	window.chart = new Highcharts.Chart({
	            
	    chart: {
	        renderTo: 'container',
	        polar: true,
	        type: 'line'
	    },
	    
	    title: {
	        text: 'Budget vs spending',
	        x: -80
	    },
	    
	    pane: {
	        startAngle: 0,
	        endAngle: 360
	    },
	
	    xAxis: {
	        categories: ['Sales', 'Marketing', 'Development', 'Customer Support', 
	                     'Information Technology', 'Administration'],
	        tickmarkPlacement: 'on',
	        lineWidth: 0
	    },
	        
	    yAxis: {
	        gridLineInterpolation: 'polygon',
	        min: 0
	    },
	    
	    tooltip: {
	    	shared: true,
	        valuePrefix: '$'
	    },
	    
	    legend: {
	        align: 'right',
	        verticalAlign: 'top',
	        y: 100,
	        layout: 'vertical'
	    },
	    
	    series: [{
	        name: 'Allocated Budget',
	        data: [43000, 19000, 60000, 35000, 17000, 10000],
	        pointPlacement: 'on'
	    }, {
	        name: 'Actual Spending',
	        data: [50000, 39000, 42000, 31000, 26000, 14000],
	        pointPlacement: 'on'
	    }]
	
	});
});