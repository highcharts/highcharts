var chart;
$(document).ready(function() {

	// define the options
	var options = {

		chart: {
			renderTo: 'container'
		},

		title: {
			text: 'Daily visits at www.highcharts.com'
		},

		subtitle: {
			text: 'Source: Google Analytics'
		},

		xAxis: {
			type: 'datetime',
			tickInterval: 7 * 24 * 3600 * 1000, // one week
			tickWidth: 0,
			gridLineWidth: 1,
			labels: {
				align: 'left',
				x: 3,
				y: -3
			}
		},

		yAxis: [{ // left y axis
			title: {
				text: null
			},
			labels: {
				align: 'left',
				x: 3,
				y: 16,
				formatter: function() {
					return Highcharts.numberFormat(this.value, 0);
				}
			},
			showFirstLabel: false
		}, { // right y axis
			linkedTo: 0,
			gridLineWidth: 0,
			opposite: true,
			title: {
				text: null
			},
			labels: {
				align: 'right',
				x: -3,
				y: 16,
				formatter: function() {
					return Highcharts.numberFormat(this.value, 0);
				}
			},
			showFirstLabel: false
		}],

		legend: {
			align: 'left',
			verticalAlign: 'top',
			y: 20,
			floating: true,
			borderWidth: 0
		},

		tooltip: {
			shared: true,
			crosshairs: true
		},

		plotOptions: {
			series: {
				cursor: 'pointer',
				point: {
					events: {
						click: function() {
							hs.htmlExpand(null, {
								pageOrigin: {
									x: this.pageX,
									y: this.pageY
								},
								headingText: this.series.name,
								maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) +':<br/> '+
									this.y +' visits',
								width: 200
							});
						}
					}
				},
				marker: {
					lineWidth: 1
				}
			}
		},

		series: [{
			name: 'All visits',
			lineWidth: 4,
			marker: {
				radius: 4
			}
		}, {
			name: 'New visitors'
		}]
	};


	// Load data asynchronously using jQuery. On success, add the data
	// to the options and initiate the chart.
	// This data is obtained by exporting a GA custom report to TSV.
	// http://api.jquery.com/jQuery.get/
	jQuery.get('analytics.tsv', null, function(tsv, state, xhr) {
		var lines = [],
			listen = false,
			date,

			// set up the two data series
			allVisits = [],
			newVisitors = [];

		// inconsistency
		if (typeof tsv !== 'string') {
			tsv = xhr.responseText;
		}

		// split the data return into lines and parse them
		tsv = tsv.split(/\n/g);
		jQuery.each(tsv, function(i, line) {

			// listen for data lines between the Graph and Table headers
			if (tsv[i - 3] == '# Graph') {
				listen = true;
			} else if (line == '' || line.charAt(0) == '#') {
				listen = false;
			}

			// all data lines start with a double quote
			if (listen) {
				line = line.split(/\t/);
				date = Date.parse(line[0] +' UTC');

				allVisits.push([
					date,
					parseInt(line[1].replace(',', ''), 10)
				]);
				newVisitors.push([
					date,
					parseInt(line[2].replace(',', ''), 10)
				]);
			}
		});

		options.series[0].data = allVisits;
		options.series[1].data = newVisitors;

		chart = new Highcharts.Chart(options);
	});
});
