$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	        // alignTicks: true // by default
	    },
	    
	    yAxis: [{
	        title: {
	            text: 'GOOGL'
	        }
	    }, {
	        title: {
	            text: 'MSFT'
	        },
	        gridLineWidth: 0,
	        opposite: true
	    }],
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'GOOGL',
	        data: GOOGL
	    }, {
	        name: 'MSFT',
	        data: MSFT,
	        yAxis: 1
	    }]
	});
});