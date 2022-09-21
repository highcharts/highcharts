(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@b0488c7087/samples/data/busiest-europe-airports-2021.json', data => {

        data.forEach(airport => {
            airport.z = airport.total_passengers;
        });

        Highcharts.mapChart('container', {
            chart: {
                borderWidth: 1,
                map: topology
            },

            title: {
                text: `Top 100 busiest airports in Europe, ranked by total
                passengers in 2021`
            },

            subtitle: {
                text: `Demo of Highcharts map with bubbles | Source:
                <a href='https://w.wiki/5j6g'>
                    Wikipedia
                </a> and
                <a href='https://ourairports.com/continents/EU/'>
                    OurAirports
                </a>`
            },

            accessibility: {
                description: `We see how the top 100 busiest airports in Europe,
                ranked by total passengers in 2021 look like.`
            },

            legend: {
                enabled: false
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            mapView: {
                projection: {
                    name: 'WebMercator'
                },
                zoom: 3.35,
                center: [15, 50.5]
            },

            plotOptions: {
                mapbubble: {
                    minSize: 30,
                    maxSize: 200,
                    opacity: 0.3,
                    marker: {
                        lineWidth: 0,
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    }
                }
            },

            series: [{
                name: 'Countries',
                color: '#E0E0E0',
                enableMouseTracking: false
            }, {
                type: 'mapbubble',
                name: 'Europe airports',
                data: data,
                tooltip: {
                    pointFormat: '{point.name}: {point.z}'
                },
                blendColors: [
                    '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'
                ]
            }]
        });
    });

})();
