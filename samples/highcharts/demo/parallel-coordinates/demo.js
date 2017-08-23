$.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=marathon.json&callback=?', function (data) {
	Highcharts.chart('container', {
		chart: {
			type: 'spline',
			parallelCoordinates: true,
			parallelAxes: {
				lineWidth: 2
			}
		},
		title: {
			text: 'Marathon set'
		},
		plotOptions: {
			series: {
				animation: false,
				lineWidth: 1,
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: false
						}
					}
				},
				states: {
					hover: {
						halo: {
							size: 0
						}
					}
				},
				events: {
					mouseOver: function () {
						this.group.toFront();
					}
				}
			}
		},
		xAxis: {
			categories: ['Training date', 'Miles for training run',  'Training time', 'Shoe brand', 'Running pace per mile',  'Short or long', 'After 2004']
		},
		yAxis: [{
			type: 'datetime'
		}, {
			min: 0
		}, {
			type: 'datetime',
			min: 0,
			labels: {
				format: '{value:%H:%M}'
			}
		}, {
			categories: ['Other', 'Adidas', 'Mizuno', 'Asics', 'Brooks', 'New Balance', 'Izumi']
		}, {
			type: 'datetime'
		}, {
			categories: ['> 5miles', '< 5miles']
		}, {
			categories: ['Before', 'After']
		}],
		colors: ['rgba(11, 200, 200, 0.1)'],
		series: data.map(function(set, i) {
			return {
				name: 'Runner' + i,
				data: set
			};
		})
	});
});
