Highcharts.chart('container', {
	chart: {
		renderTo: 'container',
		type: 'column'
	},
	title: {
		text: 'Restaurants Complaints'
	},
	xAxis: {
		categories: ['Overpriced', 'Small portions', 'Wait time', 'Food is tasteless', 'No atmosphere', 'Not clean', 'Too noisy', 'Unfriendly staff'],
	},
	yAxis: [{
		title: {
			text: ''
		},
	}, {
		title: {
			text: ''
		},
		minPadding: 0,
		maxPadding: 0,
		max: 100,
		min: 0,
		opposite: true,
		labels: {
			format: "{value}%"
		}
	}],
	series: [{
		name: 'complaints',
		type: 'column',
		id: 'pareto',
		data: [755, 222, 151, 86, 72, 51, 36, 10]
	}, {
		type: 'pareto',
		linkedTo: 'pareto',
		yAxis: 1
	}]
});