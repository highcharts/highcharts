/*
TODO before publish:
- Consider smoothing of the temperature graph
- Check VML
*/


var chart;
$(function() {
	// Parallel arrays for the chart data
	var symbols = [],
		precipitations = [],
		windDirections = [],
		windSpeeds = [],
		windSpeedNames = [],
		temperatures = [],
		pressures = [];
		
	// Other data
	var locationName,
		locationCountry,
		pointStart,
		tooltips;
		
	// Sprites as laid out at http://om.yr.no/forklaring/symbol/
	var symbolSize = 30,
		symbolSprites = {
		'01d': {
			x: 0,
			y: 0
		},
		'01n': {
			x: 1 * symbolSize,
			y: 0
		},
		'16': {
			x: 2 * symbolSize,
			y: 0
		},
		'02d': {
			x: 0,
			y: 1 * symbolSize
		},
		'02n': {
			x: 1 * symbolSize,
			y: 1 * symbolSize
		},
		'03d': {
			x: 0,
			y: 2 * symbolSize
		},
		'03n': {
			x: 1 * symbolSize,
			y: 2 * symbolSize
		},
		'17': {
			x: 2 * symbolSize,
			y: 2 * symbolSize
		},
		'04': {
			x: 0,
			y: 3 * symbolSize
		},
		'05d': {
			x: 0, 
			y: 4 * symbolSize
		},
		'05n': {
			x: symbolSize,
			y: 4 * symbolSize,
		},
		'18': {
			x: 2 * symbolSize,
			y: 4 * symbolSize
		},
		'06d': {
			x: 0,
			y: 5 * symbolSize
		},
		'06n': {
			x: 1 * symbolSize,
			y: 5 * symbolSize
		},
		'07d': {
			x: 0,
			y: 6 * symbolSize
		},
		'07n': {
			x: 1 * symbolSize,
			y: 6 * symbolSize
		},
		'08d': {
			x: 0,
			y: 7 * symbolSize
		},
		'08n': {
			x: 1 * symbolSize,
			y: 7 * symbolSize
		},
		'19': {
			x: 2 * symbolSize,
			y: 7 * symbolSize
		},
		'09': {
			x: 0,
			y: 8 * symbolSize
		},
		'10': {
			x: 0,
			y: 9 * symbolSize
		},
		'11': {
			x: 0,
			y: 10 * symbolSize
		},
		'12': {
			x: 0,
			y: 11 * symbolSize
		},
		'13': {
			x: 0,
			y: 12 * symbolSize
		},
		'14': {
			x: 0,
			y: 13 * symbolSize
		},
		'15': {
			x: 0,
			y: 14 * symbolSize
		},
		'20d': {
			x: 0,
			y: 15 * symbolSize
		},
		'20n': {
			x: 1 * symbolSize,
			y: 15 * symbolSize
		},
		'20m': {
			x: 2 * symbolSize,
			y: 15 * symbolSize
		},
		'21d': {
			x: 0,
			y: 16 * symbolSize
		},
		'21n': {
			x: 1 * symbolSize,
			y: 16 * symbolSize
		},
		'21m': {
			x: 2 * symbolSize,
			y: 16 * symbolSize
		},
		'22': {
			x: 0,
			y: 17 * symbolSize
		},
		'23': {
			x: 0,
			y: 18 * symbolSize
		}
	};

	/**
	 * Create wind speed symbols for the Beaufort wind scale. The symbols are rotated
	 * around the x, y centerpoint.
	 */
	function windArrow (x, y, name) {
		var level, 
			path;

		// The stem and the arrow head
		path = [
			'M', x, y + 7, // base of arrow
			x - 1.5, y + 7,
			x, y + 10,
			x + 1.5, y + 7,
			x, y + 7,
			x, y - 10, // top
		];

		level = $.inArray(name, ['Calm', 'Light air', 'Light breeze', 'Gentle breeze', 'Moderate breeze',
			'Fresh breeze', 'Strong breeze', 'Near gale', 'Gale', 'Strong gale', 'Storm',
			'Violent storm', 'Hurricane']);

		if (level === 0) {
			path = []; // TODO: circle
		}

		if (level == 2) {
			path.push('M', x, y - 8, x + 4, y - 8); // short line
		} else if (level >= 3) {
			path.push(x, y - 10, x + 7, y - 10); // long line
		}

		if (level == 4) {
			path.push('M', x, y - 7, x + 4, y - 7);
		} else if (level >= 5) {
			path.push('M', x, y - 7, x + 7, y - 7);
		}

		if (level == 5) {
			path.push('M', x, y - 4, x + 4, y - 4);
		} else if (level >= 6) {
			path.push('M', x, y - 4, x + 7, y - 4);
		}

		if (level == 7) {
			path.push('M', x, y - 1, x + 4, y - 1);
		} else if (level >= 8) {
			path.push('M', x, y - 1, x + 7, y - 1);
		}

		return path;
	}
	
	/**
	 * Create the chart. This function is called when the data file is loaded and parsed.
	 */
	function createChart() {
		chart = new Highcharts.Chart({
    
            chart: {
                renderTo: 'container',
                marginBottom: 70,
                marginRight: 40,
                marginTop: 50,
				plotBorderWidth: 1
            },
			
			title: {
				text: 'Meteogram for '+ locationName +', '+ locationCountry,
				align: 'left'
			},
			
			credits: {
				text: 'Forecast from <a href="http://yr.no">yr.no</a>',
				position: {
					x: -40
				}
			},
			
			tooltip: {
				shared: true,
				useHTML: true,
				formatter: function () {

					// Create the header with reference to the time interval
					var index = this.points[0].point.index,
						ret = '<small>' + Highcharts.dateFormat('%A, %b %e, %H:%M', this.x) + '-' +
							Highcharts.dateFormat('%H:%M', this.x + 36e5) + '</small>';

					ret += '<table>';

					// Add all series
					Highcharts.each(this.points, function (point) {
						var series = point.series;
						ret += '<tr><td style="color:'+ series.color + '">' + series.name +
							': </td><td>' + point.y + series.options.tooltip.valueSuffix + '</td></tr>';
					});

					// Add wind
					ret += '<tr><td>Wind speed</td><td>' + windSpeedNames[index] + ' (' + 
						Highcharts.numberFormat(windSpeeds[index], 1) + ' m/s)</td></tr>';

					// Close
					ret += '</table>';


					return ret;
				}
			},
			
            xAxis: [{ // Bottom X axis
                type: 'datetime',
                tickInterval: 2 * 36e5, // two hours
				tickPosition: 'inside',
				minorTickInterval: 36e5, // one hour
				tickLength: 0,
				gridLineWidth: 1,
				gridLineColor: (Highcharts.theme && Highcharts.theme.background2) || '#F0F0F0',
				startOnTick: false,
				endOnTick: false,
				minPadding: 0,
				maxPadding: 0,
				offset: 30,
				showLastLabel: true,
                labels: {
                    format: '{value:%H}'
                }
            }, { // Top X axis
				linkedTo: 0,
				type: 'datetime',
				tickInterval: 24 * 3600 * 1000,
                labels: {
                    format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
					align: 'left',
					x: 3,
					y: -5
                },
				opposite: true,
				tickLength: 20,
				gridLineWidth: 1
			}],
			
			yAxis: [{ // temperature axis
				title: {
					text: null
				},
				labels: {
					format: '{value}°',
					style: {
						fontSize: '10px'
					},
					x: -3
				},
				plotLines: [{ // zero plane
					value: 0,
					color: '#BBBBBB',
					width: 1,
					zIndex: 2
				}],
				// Custom positioner to provide even temperature ticks from top down
				tickPositioner: function () {
					var max = Math.ceil(this.max) + 1,
						pos = max - 12, // start
						ret;

					if (pos < this.min) {
						ret = [];
						while (pos <= max) {
							ret.push(pos++);
						}
					} // else return undefined and go auto

					return ret;

				},
				maxPadding: 0.3,
				tickInterval: 1,
				gridLineColor: (Highcharts.theme && Highcharts.theme.background2) || '#F0F0F0'
				
			}, { // precipitation axis
				title: {
					text: null
				},
				labels: {
					enabled: false
				},
				gridLineWidth: 0,
				tickLength: 0
			
			}, { //  air pressure
				allowDecimals: false,
				title: null,
				labels: {
					formatter: function () {
						return this.isLast ? 'hPa' : this.value; // skip numberFormat
					},
					style: {
						fontSize: '8px',
						color: Highcharts.getOptions().colors[2] 
					},
					y: 2,
					x: 3
				},
				gridLineWidth: 0,
				opposite: true
			}],
            
            legend: {
                enabled: false
            },

            plotOptions: {
            	series: {
            		pointPlacement: 'between'
            	}
            },
			
            
            series: [{
				name: 'Temperature',
                data: temperatures,
				type: 'spline',
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: true
						}
					}
				},
				tooltip: {
					valueSuffix: '°C'
				},
				zIndex: 1,
				color: '#FF3333',
				negativeColor: '#48AFE8'
            }, {
				name: 'Precipitation',
                data: precipitations,
				type: 'column',
				color: '#68CFE8',
				yAxis: 1,
				groupPadding: 0,
				pointPadding: 0,
				borderWidth: 0,
				shadow: false,
				dataLabels: {
					enabled: true,
					formatter: function () {
						if (this.y > 0) {
							return this.y;
						}
					},
					style: {
						fontSize: '8px'
					}
				},
				tooltip: {
					valueSuffix: 'mm'
				}
				//pointPlacement: 'between'
            }, {
				name: 'Air pressure',
				color: Highcharts.getOptions().colors[2],
                data: pressures,
                marker: {
                	enabled: false
                },
				shadow: false,
				tooltip: {
					valueSuffix: ' hPa'
				},
				dashStyle: 'shortdot',
				yAxis: 2
            }]
        
        }, 

        // Post-process the chart from the callback function
        function (chart) {
			$.each(chart.series[0].data, function(i, point) {
				var sprite;
				
				if (i % 2 === 0) {
					// Draw the weather symbols on the temperature graph
					sprite = symbolSprites[symbols[i]];
					if (sprite) {
						chart.renderer.image(
							'http://www.highcharts.com/samples/graphics/meteogram-symbols-30px.png',
							point.plotX + chart.plotLeft - 15,
							point.plotY + chart.plotTop - 30,
							90,
							570
						)
						.clip(chart.renderer.clipRect(
							point.plotX + chart.plotLeft - 15 + sprite.x,
							point.plotY + chart.plotTop - 30 + sprite.y,
							30,
							30
						))
						.translate(-sprite.x, -sprite.y)
						.attr({
							zIndex: 5
						})
						.add();
					}
					
					
					// Draw the wind arrows
					chart.renderer.path(
						windArrow(point.plotX + chart.plotLeft + 7,	255, windSpeedNames[i])
					)
					.attr({
						rotation: parseInt(windDirections[i], 10),
						x: point.plotX + chart.plotLeft + 7, // rotation center
						y: 255, // rotation center
						stroke: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
						'stroke-width': 1.5,
						zIndex: 5
					})
					.add();

				}
			});

			// Draw blocks around wind arrows
			var xAxis = chart.xAxis[0],
				x,
				pos,
				max,
				i;

			for (pos = chart.xAxis[0].min, max = chart.xAxis[0].max, i = 0; pos <= max + 36e5; pos += 36e5, i ++) {
				x = Math.round(chart.xAxis[0].toPixels(pos)) + (i === 0 ? 0.5 : -0.5);
				
				// Vertical dividers
				if (i % 2 === 0) {
					chart.renderer.path(['M', x, chart.plotTop + chart.plotHeight,
						'L', x, chart.plotTop + chart.plotHeight + 30, 'Z'])
						.attr({
							'stroke': chart.options.chart.plotBorderColor,
							'stroke-width': 1
						})
						.add();
				}

				// Ticks
				chart.renderer.path(['M', x, chart.plotTop + chart.plotHeight + 28,
					'L', x, chart.plotTop + chart.plotHeight + 32, 'Z'])
					.attr({
						'stroke': chart.options.chart.plotBorderColor,
						'stroke-width': 1
					})
					.add();
			}

			
            
        });
	}
	/*************************************************
	* Handle the data. This part of the code is not  *
	* Highcharts specific, but deals with yr.no's    *
	* specific data format                           *
	*************************************************/
	if (!location.hash) {
		//location.hash = 'http://www.yr.no/place/Norway/Sogn_og_Fjordane/Selje/Stadlandet//forecast_hour_by_hour.xml';
		//location.hash = 'http://www.yr.no/place/Norway/Sogn_og_Fjordane/Vik/Voll/forecast_hour_by_hour.xml';
		location.hash = 'http://www.yr.no/place/United_Kingdom/England/London/forecast_hour_by_hour.xml';
	}
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?url=' + location.hash.substr(1) + '&callback=?', function (xml) {

    	// The returned xml variable is a JavaScript representation of the provided XML, 
    	// generated on the server by running PHP simple_load_xml and converting it to 
    	// JavaScript by json_encode.
    	$.each(xml.forecast.tabular.time, function(i, time) {
			// Get the times - only Safari can't parse ISO8601 so we need to do some replacements 
			var from = time['@attributes'].from +' UTC';
			from = from.replace(/-/g, '/').replace('T', ' ');
			from = Date.parse(from);
			var to = time['@attributes'].to +' UTC';
			to = to.replace(/-/g, '/').replace('T', ' ');
			to = Date.parse(to);
			var middle = (from + to) / 2;
			
			if (to > pointStart + 4 * 24 * 3600 * 1000) {
				return;
			}
			
			// Populate the parallel arrays
			symbols.push(time.symbol['@attributes'].var.match(/[0-9]{2}[dnm]?/)[0]);
			temperatures.push({
				x: from,
				y: parseInt(time.temperature['@attributes'].value),
				index: i
			});
			precipitations.push({
				x: from,
				y: parseFloat(time.precipitation['@attributes'].value)
			});
			windDirections.push(parseFloat(time.windDirection['@attributes'].deg));
			windSpeeds.push(parseFloat(time.windSpeed['@attributes'].mps));
			windSpeedNames.push(time.windSpeed['@attributes'].name);
			pressures.push({
				x: from,
				y: parseFloat(time.pressure['@attributes'].value)
			});
			
			if (i == 0) {
				pointStart = middle;
			}	
		});
		
		// populate other data
		locationName = xml.location.name;
		locationCountry = xml.location.country;
		
		// create the chart when the data is loaded
		createChart();
    });
    
    
});