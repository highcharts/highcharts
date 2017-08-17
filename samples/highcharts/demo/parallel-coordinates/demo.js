$.getJSON('https://www.highcharts.com/samples/data/marathon.json', function (data) {
	Highcharts.chart('container', {
		chart: {
			type: 'spline',
			parallelCoordinates: true
		},
		title: {
			text: 'Marathon trainings'
		},
		plotOptions: {
			series: {
				lineWidth: 1,
				marker: {
					enabled: false
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
			categories: ['< 5miles', '> 5miles']
		}, {
			categories: ['After', 'Before']
		}],
		colors: ['rgba(11, 200, 200, 0.1)'],
		series: data.map(function (set) {
			return {
				data: set
			}
		})
	});
});