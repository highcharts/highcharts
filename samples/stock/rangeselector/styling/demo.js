$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    rangeSelector: {
	    	buttonTheme: { // styles for the buttons
	    		fill: 'none',
	    		stroke: 'none',
	    		'stroke-width': 0,
	    		r: 8,
	    		style: {
	    			color: '#039',
	    			fontWeight: 'bold'
	    		},
	    		states: {
	    			hover: {
	    			},
	    			select: {
	    				fill: '#039',
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