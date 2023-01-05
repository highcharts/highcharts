(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps flowmap demo with fillColor and fillOpacity'
        },

        mapNavigation: {
            enabled: true
        },

        plotOptions: {
            flowmap: {
                minWidth: 5,
                maxWidth: 15,
                growTowards: true
            },
            mappoint: {
                tooltip: {
                    headerFormat: '{point.point.id}<br>',
                    pointFormat: 'Lat: {point.lat} Lon: {point.lon}'
                }
            }
        },

        series: [{
            name: 'Basemap',
            states: {
                inactive: {
                    enabled: false
                }
            }
        }, {
            type: 'mappoint',
            id: 'europe',
            name: 'Cities',
            dataLabels: {
                format: '{point.id}'
            },
            data: [{
                id: 'Oslo',
                lat: 60.1975501,
                lon: 11.1004152
            }, {
                id: 'Warszawa',
                lat: 52.169192,
                lon: 20.973514
            }, {

                id: 'Paris',
                lat: 48.7294,
                lon: 2.3681
            }, {
                id: 'Roma',
                lat: 41.80423809568812,
                lon: 12.59955883026123
            }, {
                id: 'Madrid',
                lat: 40.4650078,
                lon: -3.57069739999997
            }, {
                id: 'Dublin',
                lat: 53.42801115,
                lon: -6.240388650000005
            }, {
                id: 'Helsinki',
                lat: 60.317887,
                lon: 24.96695
            }, {
                id: 'Budapest',
                lat: 47.4329065837921,
                lon: 19.2617931962013
            }, {
                id: 'Sofia',
                lat: 42.6885203,
                lon: 23.39719025
            }]
        }, {
            type: 'flowmap',
            linkedTo: ':previous',
            markerEnd: {
                enabled: true,
                markerType: 'arrow',
                width: '50%',
                height: '50%'
            },
            fillColor: '#31c2cc',
            fillOpacity: 0.2,
            color: '#0000FF',
            data: [{
                from: 'Warszawa',
                to: 'Helsinki',
                weight: 10
            }, {
                from: 'Warszawa',
                to: 'Paris',
                weight: 5
            }, {
                from: 'Warszawa',
                to: 'Madrid',
                weight: 20
            }, {
                from: 'Warszawa',
                to: 'Budapest',
                weight: 0.1
            }, {
                from: 'Warszawa',
                to: 'Sofia',
                weight: 60,
                fillColor: '#1cd635',
                fillOpacity: 0.4,
                opacity: 0.2
            }, {
                from: 'Warszawa',
                to: 'Roma',
                weight: 2,
                markerEnd: {
                    enabled: true,
                    markerType: 'arrow',
                    width: 14,
                    height: 24
                }
            }]
        }, {
            type: 'flowmap',
            linkedTo: 'europe',
            color: 'black',
            fillColor: 'rgb(255, 0, 0)',
            fillOpacity: 1,
            data: [{
                from: 'Oslo',
                to: 'Helsinki',
                weight: 20,
                markerEnd: {
                    enabled: true,
                    width: '70%',
                    height: '70%'
                }
            }, {
                from: 'Oslo',
                to: 'Dublin',
                weight: 70,
                opacity: 0.2
            }, {
                from: 'Oslo',
                to: 'Warszawa',
                weight: 2,
                markerEnd: {
                    width: 20,
                    height: '100%'
                }
            }]
        }]
    });
})();
