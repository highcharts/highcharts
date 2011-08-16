$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	    },
	    
	    plotOptions: {
	    	series: {
	    		marker: {
	    			enabled: true
	    		}
	    	}
	    },
	    
	    tooltip: {
	    	shared: false
	    },
	    
	    rangeSelector: {
	    	selected: 4	
	    },
	    
	    series: [{
	        name: 'ADBE',
	        data: ADBE,
	        dataGrouping: {
	        	groupPixelWidth: 10
	        }
	    }, {
	        name: 'MSFT',
	        data: MSFT,
	        dataGrouping: {
	        	groupPixelWidth: 50
	        }
	    }]
	});
});