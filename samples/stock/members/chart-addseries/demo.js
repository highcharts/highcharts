$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
        scrollbar: {
            enabled: true
        },
        
        navigator: {
            enabled: true
        },
        
	    rangeSelector: {
	    	selected: 1
	    },
        
        series: [{
			name: 'MSFT',
			data: MSFT
        }]
	});
	
	$('#button').click(function() {
		chart.addSeries({
			name: 'ADBE',
			data: ADBE
		});
        $('#button')[0].disabled = true;
	});
});