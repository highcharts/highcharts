$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    loading: {
	    	style: {
	    		backgroundColor: 'silver'
	    	},
	    	labelStyle: {
	    		color: 'white'
	    	}
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	});
	
	$('#showloading').click(function() {
		chart.showLoading();
	});
	$('#hideloading').click(function() {
		chart.hideLoading();
	});
});