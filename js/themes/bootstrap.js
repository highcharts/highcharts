/**
 * Bootstrap theme for Highcharts JS
 * @author Martin Aarhof
 */

Highcharts.theme = {
	colors: ['#0044cc', '#2f96b4', '#51a351', '#f89406', '#bd362f', '#222222'],
	chart: {
		backgroundColor: 'transparent',
		plotBackgroundColor: 'transparent',
		plotShadow: true,
		plotBorderWidth: 0
	},
	title: {
		style: {
			color: '#333',
			font: 'bold 20px "Helvetica Neue", Helvetica, Arial, sans-serif'
		}
	},
	subtitle: {
		style: {
			color: '#666666',
			font: 'bold 12px "Helvetica Neue", Helvetica, Arial, sans-serif'
		}
	},
	xAxis: {
		gridLineWidth: 1,
		lineColor: '#333',
		tickColor: '#333',
		labels: {
			style: {
				color: '#333',
				font: '11px "Helvetica Neue", Helvetica, Arial, sans-serif'
			}
		},
		title: {
			style: {
				color: '#333',
				fontWeight: 'bold',
				fontSize: '12px',
				fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'

			}
		}
	},
	yAxis: {
		minorTickInterval: 'auto',
		lineColor: '#333',
		lineWidth: 1,
		tickWidth: 1,
		tickColor: '#333',
		labels: {
			style: {
				color: '#000',
				font: '11px "Helvetica Neue", Helvetica, Arial, sans-serif'
			}
		},
		title: {
			style: {
				color: '#333',
				fontWeight: 'bold',
				fontSize: '12px',
				fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
			}
		}
	},
	legend: {
		itemStyle: {
			font: '9pt "Helvetica Neue", Helvetica, Arial, sans-serif',
			color: '#333'

		},
		itemHoverStyle: {
			color: '#039'
		},
		itemHiddenStyle: {
			color: 'gray'
		}
	},
	labels: {
		style: {
			color: '#99b'
		}
	},

	navigation: {
		buttonOptions: {
			theme: {
				stroke: '#CCCCCC'
			}
		}
	}
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);

