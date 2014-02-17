var mapChart;

function getMapChart(container) {
	mapChart = new Highcharts.Map({
        chart: {
            renderTo: container,
        },
        title: {
            text: 'Germany'
        },
        subtitle: {
            text: 'Click region for details'
        },
        plotOptions: {
            map: {
                allAreas: true,
                color: '#EEEEEE',
                borderColor: '#404040',
                showInLegend: false,
                events: {
                    click: function (e) {
                    	showResults(e.point.name);
                    }
                }
            }
        },
        series: [],
        drilldown: {
            drillUpButton: {
                relativeTo: 'spacingBox'
            },
        }
    });

	return mapChart;
}

function loadMapData() {

    var mapData = new Highcharts.Data({
        svg: "Germany.svg",
        complete: function(options) {
            var ALLDATA = [],
                DRILLDATA = [];

            Highcharts.each(options.series[0].data, function(point) {
                ALLDATA.push({
                    name: point.name,
                    path: point.path
                });
            });
            mapChart.addSeries({
                name: 'Germany',
                data: ALLDATA
            });
        }
    });
}