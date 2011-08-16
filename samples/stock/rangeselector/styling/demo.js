$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	    },
	    
	    rangeSelector: {
	    	buttonTheme: { // styles for the buttons
	    		fill: 'none',
	    		stroke: 'none',
	    		style: {
	    			color: '#039',
	    			fontWeight: 'bold'
	    		},
	    		states: {
	    			hover: {
	    				fill: 'white'
	    			},
	    			select: {
	    				style: {
	    					color: 'white'
	    				}
	    			}
	    		}
	    	},
	    	inputStyle: {
	    		color: '#039',
	    		fontWeight: 'bold'
	    	},
	    	labelStyle: {
	    		color: 'silver',
	    		fontWeight: 'bold'
	    	},
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	});
});