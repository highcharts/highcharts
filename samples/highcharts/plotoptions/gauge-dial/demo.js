$(function () {
	
    var chart = new Highcharts.Chart({
	
	    chart: {
	        renderTo: 'container',
	        type: 'gauge'
	    },
	    
	    pane: {
	    	startAngle: -150,
	    	endAngle: 150
	    },
	   
	    
		yAxis: {
			min: 0,
			max: 100
		},
		
		plotOptions: {
			gauge: {
				dial: {
					radius: '100%',
					backgroundColor: 'silver',
					borderColor: 'black',
					borderWidth: 1,
					baseWidth: 10,
					topWidth: 1,
					baseLength: '90%', // of radius
					rearLength: '50%'
				}
			}
		},
					
		
	    series: [{
	        data: [80]
	    }]
	
	});
});