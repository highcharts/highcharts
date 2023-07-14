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
            format: '{point.id}{#if point.lat}<br>Lat: {point.lat} Lon {point.lon}{/if}'
        },

        plotOptions: {
            series: {
                marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[1]
                }
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
                id: 'London',
                lat: 51.507222,
                lon: -0.1275
            }, {
                id: 'Birmingham',
                lat: 52.483056,
                lon: -1.893611
            }, {
                id: 'Leeds',
                lat: 53.799722,
                lon: -1.549167
            }, {
                id: 'Glasgow',
                lat: 55.858,
                lon: -4.259
            }, {
                id: 'Sheffield',
                lat: 53.383611,
                lon: -1.466944
            }, {
                id: 'Liverpool',
                lat: 53.4,
                lon: -3
            }, {
                id: 'Bristol',
                lat: 51.45,
                lon: -2.583333
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

    const londonPoint = chart.get('London'),
        lerwickPoint = chart.get('Lerwick');

    // Add a series of lines for London
    chart.addSeries({
        name: 'London flight routes',
        type: 'mapline',
        lineWidth: 2,
        color: Highcharts.getOptions().colors[3],
        data: [{
            id: 'London - Glasgow',
            path: pointsToPath(londonPoint, chart.get('Glasgow'))
        }, {
            id: 'London - Belfast',
            path: pointsToPath(londonPoint, chart.get('Belfast'), true)
        }, {
            id: 'London - Leeds',
            path: pointsToPath(londonPoint, chart.get('Leeds'))
        }, {
            id: 'London - Liverpool',
            path: pointsToPath(londonPoint, chart.get('Liverpool'), true)
        }, {
            id: 'London - Sheffield',
            path: pointsToPath(londonPoint, chart.get('Sheffield'))
        }, {
            id: 'London - Birmingham',
            path: pointsToPath(londonPoint, chart.get('Birmingham'), true)
        }, {
            id: 'London - Bristol',
            path: pointsToPath(londonPoint, chart.get('Bristol'), true)
        }]
    }, true, false);

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
