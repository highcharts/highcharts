$(function() {
	$.getJSON('http://www.highcharts.com/samples/data/from-sql.php?callback=?', function(data) {
		
		// create the chart
		window.chart = new Highcharts.StockChart({
			chart : {
				renderTo : 'container',
				zoomType: 'x'
			},

			navigator : {
				series : {
					data : data
				}
			},

			rangeSelector : {
				selected : 5 // All
			},
			
			tooltip: {
				//xDateFormat: '%Y-%m-%d %H:%M:%S'
			},
			
			xAxis : {
				events : {
					setExtremes : onSetExtremes
				},
				ordinal: true
			},

			series : [{
				//type: 'candlestick',
				name : query.stockQuote,
				data : data,
				dataGrouping : {
					enabled : false
				},
				marker: {
					enabled: true,
					radius: 2
				}
			}]
		});
	});
});

/**
 * The initial data to load
 */
var query = {
	groupBy: 'month'
};

/**
 * Load new data depending on the selected min and max
 */
function onSetExtremes(e) {
	var url,
		currentExtremes = e.target.getExtremes(),
		range = e.max - e.min;
	
	// cancel if we're reloading the same range
	if (e.min === currentExtremes.min && e.max === currentExtremes.max) {
		return false;
	}
	
	chart.showLoading('Loading data from server...');
	$.getJSON('http://www.highcharts.com/samples/data/from-sql.php?start='+ Math.round(e.min) +
			'&end='+ Math.round(e.max) +'&callback=?', function(data) {
		chart.series[0].setData(data);
		chart.hideLoading();
	});
	
	// Stop set extremes. When the new data arrives from the server, the x axis will 
	// reflect data min and max automatically. 
	return false;
}

/**
 * Helper function to build the URL for the YAHOO query based on a configuration object
 */
function buildURL(cfg) {

	var n, 
		options = [], 
		s = "http://www.highcharts.com/samples/data/from-sql.php?";

	for(n in cfg) {
		options.push(n + "=" + cfg[n]);
	}
	s += options.join("&");
	s += "&callback=?";
	console.log(s)
	return s;

}