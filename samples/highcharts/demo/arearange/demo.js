$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=range.json&callback=?', function(data) {
    
    	window.chart = new Highcharts.Chart({
    	
		    chart: {
		        renderTo: 'container',
		        type: 'arearange'
		    },
		    
		    title: {
		        text: 'Temperature variation by day'
		    },
		
		    xAxis: {
		        type: 'datetime'
		    },
		    
		    yAxis: {
		        title: {
		            text: null
		        }
		    },
		
		    tooltip: {
		        crosshairs: true,
		        valueSuffix: '°C'
		    },
		    
		    plotOptions: {
		        arearange: {
		            marker: {
		                enabled: true
		            }
		        }
		    },
		    
		    legend: {
		        enabled: false
		    },
		
		    series: [{
		        name: 'Temperatures',
		        data: data
		    }]
		
		});
    });
    
});