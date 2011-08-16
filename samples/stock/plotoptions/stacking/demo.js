$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container',
	        type: 'area'
	    },
	    
	    plotOptions: {
	    	series: {
	    		stacking: 'normal'
	    	}
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'ADBE',
	        data: ADBE
	    }, {
	        name: 'MSFT',
	        data: MSFT
	    }]
	});
});