var resultChart;

function getResultChart(container) {
	resultChart = new Highcharts.Chart({
        chart: {
            renderTo: container,
            type: 'column',
            plotBackgroundColor: '#C0C0C0'
        },
        tooltip: {
            formatter: function () {
            	return '<b>' + this.point.name + ': </b> ' + this.point.y;
            }
        },
        plotOptions: {
            column: {
                stacking: false,
                dataLabels: {
                    enabled: true,
                    style: {
                    	fontWeight: 'bold'
                    }
                },
                    colorByPoint: true
            },
        },
        title: {
            text: 'No Constituency selected',
        },
        yAxis: {
            min: 0,
            gridLineColor: 'white',
            title: {
                text: 'Number of Votes'
            },
            plotBands: [{
                value: 5,
                color: '#FF0000',
                width: 2,
                zIndex: 3
            }
            ]
        },
        xAxis: {
            type: 'category'
        },
        series: [],
        drilldown: {
            drillUpButton: {
                relativeTo: 'spacingBox',
                y: -25
            },
            series: []
        }
    });

	return resultChart;
}

function showResults (constituency) {
	resultChart.title.attr({
        text: constituency
    });

    if (resultChart.series !== 0) {
    	Highcharts.each(resultChart.series, function(serie) {
    		serie.remove();
    	});
    }

    //constituency.replace(/ /g, '');
    console.log(constituency);
    console.log(ALLRESULTS_LU[constituency]);
    if (ALLRESULTS_LU[constituency]) {

    	resultChart.addSeries(ALLRESULTS_LU[constituency]);
    }
}

var ALLRESULTS = [],
	ALLRESULTS_LU;

function loadResults (file) {
	$.get(file, function (data) {
		var lines = data.split('\n');
		var fields = [];

		$.each(lines, function (lineNo, line) {
        	var items = line.split(';');
			if (lineNo === 0) { 
	            $.each(items, function(itemNo, item) {
	                fields.push(item);
	            });
			} else  if (lineNo > 2) { 
				if (items[2] != 99 && items[1]) {
					var result = {
						name: items[1],
						data: []
					}

					for (i = 19; i < items.length; i += 4) {
						if (items[i] !== '') {
							result.data.push({
								name: fields[i],
								y: parseFloat(items[i])
							});
						}
					}
					ALLRESULTS.push(result);
				}
			}
		});

		//console.log(ALLRESULTS);
		ALLRESULTS_LU = createLookUpTable(ALLRESULTS, 'name');
		//console.log(ALLRESULTS_LU);
	});
}


function createLookUpTable(array, ID) {
	var result = {};
	Highcharts.each(array, function(item) {
		result[item[ID]] = item;
	})
	console.log(result);
	return result;
}