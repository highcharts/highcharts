(async () => {

    const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/gb/gb-all.topo.json'
    ).then(response => response.json());

    // Initialize the chart
    const chart = Highcharts.mapChart('container', {

        title: {
            text: 'Highmaps simple flight routes demo',
            align: 'left'
        },

        legend: {
            align: 'left',
            layout: 'vertical',
            floating: true
        },

        accessibility: {
            point: {
                valueDescriptionFormat: '{xDescription}.'
            }
        },

        mapNavigation: {
            enabled: true
        },

        tooltip: {
            formatter: function () {
                return this.point.id + (
                    this.point.lat ?
                        '<br>Lat: ' + this.point.lat + ' Lon: ' + this.point.lon : ''
                );
            }
        },

        plotOptions: {
            series: {
                marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[1]
                }
            },
            mapline: {
                colorByPoint: false
            }
        },

        series: [{
            // Use the gb-all map with no data as a basemap
            mapData,
            name: 'Great Britain',
            borderColor: '#707070',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false
        }, {
            // Specify cities using lat/lon
            type: 'mappoint',
            name: 'Cities',
            dataLabels: {
                format: '{point.id}'
            },
            // Use id instead of name to allow for referencing points later using
            // chart.get
            data: [{
                id: 'Leeds',
                lat: 53.799722,
                lon: -1.549167
            }, {
                id: 'Glasgow',
                lat: 55.858,
                lon: -4.259
            }, {
                id: 'Liverpool',
                lat: 53.4,
                lon: -3
            }, {
                id: 'Belfast',
                lat: 54.597,
                lon: -5.93
            }, {
                id: 'Lerwick',
                lat: 60.155,
                lon: -1.145,
                dataLabels: {
                    align: 'left',
                    x: 5,
                    verticalAlign: 'middle'
                }
            }]
        }]
    });

    // Function to return an SVG path between two points, with an arc
    function pointsToPath(fromPoint, toPoint, invertArc) {
        const
            from = chart.mapView.lonLatToProjectedUnits(fromPoint),
            to = chart.mapView.lonLatToProjectedUnits(toPoint),
            curve = 0.05,
            arcPointX = (from.x + to.x) / (invertArc ? 2 + curve : 2 - curve),
            arcPointY = (from.y + to.y) / (invertArc ? 2 + curve : 2 - curve);
        return [
            ['M', from.x, from.y],
            ['Q', arcPointX, arcPointY, to.x, to.y]
        ];
    }

    const lerwickPoint = chart.get('Lerwick');

    // Add a series of lines for Lerwick
    chart.addSeries({
        name: 'Lerwick flight routes',
        type: 'mapline',
        lineWidth: 2,
        color: Highcharts.getOptions().colors[5],
        data: [{
            id: 'Lerwick - Glasgow',
            path: pointsToPath(lerwickPoint, chart.get('Glasgow'))
        }, {
            id: 'Lerwick - Belfast',
            path: pointsToPath(lerwickPoint, chart.get('Belfast'))
        }, {
            id: 'Lerwick - Leeds',
            path: pointsToPath(lerwickPoint, chart.get('Leeds'))
        }, {
            id: 'Lerwick - Liverpool',
            path: pointsToPath(lerwickPoint, chart.get('Liverpool'))
        }]
    }, true, false);
})();
