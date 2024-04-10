(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Lines between places of the world with markerEnd'
        },

        mapNavigation: {
            enabled: true
        },

        plotOptions: {
            mappoint: {
                tooltip: {
                    headerFormat: '{point.point.id}<br>',
                    pointFormat: 'Lat: {point.lat} Lon: {point.lon}'
                },
                accessibility: {
                    point: {
                        valueDescriptionFormat: '{xDescription}.'
                    }
                }
            }
        },

        series: [{
            topology,
            states: {
                inactive: {
                    enabled: false
                }
            },
            showInLegend: false
        }, {
            type: 'mappoint',
            name: 'Cities',
            data: [{
                id: 'London',
                lat: 51.3,
                lon: 0
            }, {
                id: 'Anchourage',
                lat: 61.2,
                lon: -149.9
            }, {
                id: 'Oslo',
                lat: 59.9,
                lon: 10.8
            }, {
                id: 'Sapporo',
                lat: 43.1,
                lon: 141.3
            }, {
                id: 'Cape Town',
                lat: -34.0,
                lon: 18.7
            }, {
                id: 'Brazzaville',
                lat: -4.25,
                lon: 15.25
            }, {
                id: 'Antananarivo',
                lat: -18.9,
                lon: 47.5
            }, {
                id: 'Sydney',
                lat: -33.86,
                lon: 151.2
            }, {
                id: 'Brasilia',
                lat: -15.78,
                lon: -47.9
            }, {
                id: 'New York',
                lat: 40.69,
                lon: -74.04
            }, {
                id: 'Pagudpud',
                lat: 18.59,
                lon: 120.82
            }, {
                id: 'Santiago de Chile',
                lat: -33.45,
                lon: -70.66
            }]
        }, {
            type: 'flowmap',
            linkedTo: ':previous',
            fillColor: '#e6299d',
            fillOpacity: 0.4,
            opacity: 0.7,
            color: '#ab1521',
            minWidth: 4,
            maxWidth: 10,
            growTowards: true,
            markerEnd: {
                width: '50%',
                height: '50%'
            },
            data: [{
                from: 'Brasilia',
                to: 'Santiago de Chile',
                weight: 20
            }, {
                from: 'New York',
                to: 'Brasilia',
                weight: 16
            }, {
                from: 'Brasilia',
                to: 'Anchourage',
                weight: 4
            }, {
                from: 'Brasilia',
                to: 'Cape Town',
                fillOpacity: 1,
                weight: 6,
                growTowards: false,
                markerEnd: {
                    markerType: 'mushroom',
                    width: 10,
                    height: 20
                }
            }, {
                from: 'Brasilia',
                to: 'Oslo',
                fillColor: '#2acf0c',
                fillOpacity: 0.9,
                color: '#3c8a0b',
                growTowards: false,
                weight: 1,
                markerEnd: {
                    width: '130%',
                    height: '230%'
                }
            }, {
                from: 'Brasilia',
                to: 'Sapporo',
                weight: 30
            }, {
                from: 'Brasilia',
                to: 'Brazzaville',
                weight: 16
            }, {
                from: 'Brasilia',
                to: 'Sydney',
                weight: 16,
                fillColor: '#2470b3',
                fillOpacity: 0.9,
                color: '#182aa1'
            }, {
                from: 'Sapporo',
                to: 'Sydney',
                weight: 16
            }, {
                from: 'Sapporo',
                to: 'Pagudpud',
                weight: 16
            }, {
                from: 'Sapporo',
                to: 'London',
                weight: 16
            }, {
                from: 'Sapporo',
                to: 'Antananarivo',
                weight: 16
            }, {
                from: 'Anchourage',
                to: 'New York',
                weight: 16
            }]
        }]
    });
})();
