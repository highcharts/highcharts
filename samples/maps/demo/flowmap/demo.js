(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highmaps basic lat/lon demo'
        },

        subtitle: {
            text: 'Demo of Highcharts map.'
        },

        mapNavigation: {
            enabled: true
        },

        series: [{
            name: 'Basemap'
        }, {
            type: 'mappoint',
            name: 'Cities',
            dataLabels: {
                format: '{point.id}'
            },
            data: [{
                id: "Oslo",
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
                id: "Madrid",
                lat: 40.4650078,
                lon: -3.57069739999997
            }, {
                id: "Dublin",
                lat: 53.42801115,
                lon: -6.240388650000005
            }, {
                id: 'Helsinki',
                lat: 60.317887,
                lon: 24.96695
            }, {
                id: "Budapest",
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
            keys: [
                'from', 'to', 'curveFactor', 'weight', 'growTowards',
                'markerEnd'
            ],
            data: [
                ['Warszawa', 'Oslo', 0, 5, true, {
                    enabled: true,
                    height: 15,
                    width: 10
                }],
                ['Warszawa', 'Dublin', -0.5, 5, true, {
                    enabled: true,
                    height: 30,
                    width: 20
                }],
                ['Warszawa', 'Helsinki', 0, 5, true, {
                    enabled: true,
                    height: 15,
                    width: 20
                }],
                ['Warszawa', 'Paris', -0.3, 10, true, {
                    enabled: true,
                    height: 20,
                    width: 10.3
                }],
                ['Warszawa', 'Madrid', 0.1, 7, true, {
                    enabled: true,
                    height: 20,
                    width: 10.3
                }],
                ['Warszawa', 'Budapest', 0.1, 3, true, {
                    enabled: true,
                    height: 20,
                    width: 10.3
                }],
                ['Warszawa', 'Sofia', 1, 6, true, {
                    enabled: true,
                    height: 20,
                    width: 10.3
                }],
                ['Warszawa', 'Roma', -0.3, 6, true, {
                    enabled: true,
                    height: 20,
                    width: 10.3
                }]
            ]
        }]
    });
})();
