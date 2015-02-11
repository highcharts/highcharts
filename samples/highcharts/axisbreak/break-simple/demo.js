$(function () {
	$('#container').highcharts({
		title: {
			text: 'Sample of a simple break'
		},
		subtitle: {
			text: 'Line should be interrupted between 5 and 10'
		},
		xAxis: {
			tickInterval: 1,
			breaks: [{
				from: 5,
				to: 10,
				breakSize: 1
			}]
		},
		series: [{
			gapSize: 1,
			data: (function () {
				var _data = [],
					i;
				for (i = 0; i < 20; i++) {
					_data.push(i);
				}
				return _data;
			})()
		}]
	});
});