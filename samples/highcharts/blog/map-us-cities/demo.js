(async () => {
    try {
        // Data for the top 100 cities
        const data = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@--TODO--/samples/data/us-population-city-100.json'
        ).then(response => response.json());

        // Create the map chart
        Highcharts.mapChart('container', {
            chart: {
                height: '50%'
            },
            title: {
                text: 'US map of top 100 cities by population'
            },
            mapNavigation: {
                enabled: true,
                enableMouseWheelZoom: true,
                enableDoubleClickZoom: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            legend: {
                enabled: false
            },
            mapView: {
                fitToGeometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [-125, 25], // Southwest corner
                        [-125, 45], // Northwest corner
                        [-66, 45],  // Northeast corner
                        [-66, 25],  // Southeast corner
                        [-125, 25]  // Closing the polygon
                    ]]
                },
                padding: 5
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}</b><br>Population: {point.z:,f}'
            },
            plotOptions: {
                mapbubble: {
                    minSize: '5%',
                    maxSize: '15%',
                    allAreas: false,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [
                {
                    type: 'tiledwebmap',
                    provider: {
                        type: 'OpenStreetMap',
                        theme: 'Standard'
                    }
                },
                {
                    type: 'mapbubble',
                    name: 'Cities',
                    color: Highcharts.getOptions().colors[1],
                    data: data.map(city => ({
                        name: `${city.city}, ${city.stateAbbr}`,
                        lat: city.lat,
                        lon: city.lon,
                        z: city.population // Population used for bubble size
                    })),
                    marker: {
                        symbol: 'circle',
                        lineWidth: 1,
                        lineColor: '#ffffff'
                    }
                }
            ],
            chartOptions: {
                legend: {
                    enabled: false
                }
            }
        });
    } catch (error) {
        console.error('Error creating map chart:', error);
    }
})();
