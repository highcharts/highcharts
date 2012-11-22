$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=range.json&callback=?', function(data) {
    
    	window.chart = new Highcharts.StockChart({
    	
		    chart: {
		        renderTo: 'container',
		        type: 'areasplinerange'
		    },
		    
		    rangeSelector: {
		    	selected: 2
		    },
		    
		    title: {
		        text: 'Temperature variation by day'
		    },
		
		    tooltip: {
		        valueSuffix: '°C'
		    },
		    
		    series: [{
		        name: 'Temperatures',
		        data: data
		    }]
		
		});
    });
    
});