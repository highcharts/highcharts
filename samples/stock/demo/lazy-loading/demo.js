$(function() {
	$.getJSON('http://www.highcharts.com/samples/data/from-sql.php?callback=?', function(data) {
		
		data = [].concat(data, [[Date.UTC(2011, 9, 14, 19, 59), null]]);
		
		// create the chart
		window.chart = new Highcharts.StockChart({
			chart : {
				renderTo : 'container',
				zoomType: 'x'
			},

			navigator : {
				//enabled: false,
				series : {
					data : data
				}
			},
			
			scrollbar: {
				//enabled: false
			},
			
			rangeSelector : {
				//enabled: false,
				selected : 5 // All
			},
			
			tooltip: {
				//xDateFormat: '%Y-%m-%d %H:%M:%S'
			},
			
			xAxis : {
				events : {
					setExtremes : onSetExtremes
				},
				ordinal: false,
				minRange: 3600 * 1000 // one hour
			},
			
			plotOptions: {
				series: {
					dataGrouping: {
						enabled: false
					}
				}
			},

			series : [{
				data : data,
				marker: {
					enabled: true,
					radius: 2
				}
			}]
		});
	});
});


/**
 * Load new data depending on the selected min and max
 */
function onSetExtremes(e) { console.log('onSetExtremes')
	var url,
		currentExtremes = this.getExtremes(),
		range = e.max - e.min;
	
	// cancel if we're reloading the same range, or too narrow range
	/*if (e.min === currentExtremes.min && e.max === currentExtremes.max || e.max - e.min < this.options.minRange) {
		return false;
	}*/
	
	chart.showLoading('Loading data from server...');
	$.getJSON('http://www.highcharts.com/samples/data/from-sql.php?start='+ Math.round(e.min) +
			'&end='+ Math.round(e.max) +'&callback=?', function(data) {
		chart.series[0].setData(data);
		chart.hideLoading();
	});
	
	// Stop set extremes. When the new data arrives from the server, the x axis will 
	// reflect data min and max automatically.
	//return false;
}
