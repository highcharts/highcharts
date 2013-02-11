$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    tooltip: {
	    	formatter: function() {
				var s = '<b>'+ Highcharts.dateFormat('%A, %b %e, %Y', this.x) +'</b>';

				$.each(this.points, function(i, point) {
					s += '<br/>1 USD = '+ point.y +' EUR';
				});
            
				return s;
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
});