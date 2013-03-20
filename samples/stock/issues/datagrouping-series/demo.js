$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=range.json&callback=?', function(data) {
    
    	window.chart = new Highcharts.StockChart({
    	
		    chart: {
		        renderTo: 'container',
		        type: 'arearange'
		    },
		    
		    title: {
		        text: 'Data grouping on individual series. Groups should be weeks.'
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
		        shared: true,
		        valueSuffix: '°C'
		    },
		    
		    legend: {
		        enabled: false
		    },
		
		    series: [{
		        name: 'Temperatures',
		        data: data,
		        dataGrouping: {
		        	groupPixelWidth: 20
		        }
		    }]
		
		});
    });
    
});