(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {

        chart: {
            map: topology
        },

        title: {
            text: 'European Train Stations Near Airports',
            align: 'left'
        },

        subtitle: {
            text: 'Source: <a href="https://github.com/trainline-eu/stations">' +
                'github.com/trainline-eu/stations</a>',
            align: 'left'
        },

        colorAxis: {
            min: 0,
            max: 15
        },

        series: [{
            name: 'Europe',
            borderColor: 'rgba(0, 0, 0, 0.4)',
            states: {
                inactive: {
                    enabled: false
                }
            },
            accessibility: {
                exposeAsGroupOnly: true
            }
        }, {
            type: 'geoheatmap',
            name: 'Train Stations Near Airports',
            opacity: 0.7,
            colsize: 5,
            rowsize: 5,
            borderWidth: 1,
            interpolation: {
                enabled: true,
                blur: 2
            },
            data: [{
                lon: 10,
                lat: 50,
                value: 13
            }, {
                lon: 5,
                lat: 50,
                value: 11
            }, {
                lon: 5,
                lat: 45,
                value: 10
            }, {
                lon: 15,
                lat: 50,
                value: 9
            }, {
                lon: 0,
                lat: 50,
                value: 9
            }, {
                lon: 0,
                lat: 55,
                value: 3
            }, {
                lon: 10,
                lat: 55,
                value: 3
            }, {
                lon: 15,
                lat: 55,
                value: 5
            }, {
                lon: 0,
                lat: 45,
                value: 6
            }, {
                lon: 10,
                lat: 45,
                value: 15
            }, {
                lon: 10,
                lat: 40,
                value: 3
            }, {
                lon: 15,
                lat: 40,
                value: 9
            }, {
                lon: -5,
                lat: 35,
                value: 2
            }, {
                lon: 0,
                lat: 40,
                value: 6
            }, {
                lon: -5,
                lat: 55,
                value: 4
            }, {
                lon: -5,
                lat: 50,
                value: 2
            }, {
                lon: 15,
                lat: 45,
                value: 12
            }, {
                lon: 10,
                lat: 60,
                value: 2
            }, {
                lon: 20,
                lat: 60,
                value: 2
            }, {
                lon: 20,
                lat: 50,
                value: 6
            }, {
                lon: -10,
                lat: 40,
                value: 2
            }, {
                lon: -5,
                lat: 40,
                value: 2
            }, {
                lon: 20,
                lat: 45,
                value: 7
            }, {
                lon: 20,
                lat: 40,
                value: 3
            }, {
                lon: 15,
                lat: 35,
                value: 1
            }, {
                lon: 25,
                lat: 55,
                value: 3
            }, {
                lon: -10,
                lat: 50,
                value: 1
            }, {
                lon: 5,
                lat: 40,
                value: 2
            }, {
                lon: 25,
                lat: 45,
                value: 5
            }, {
                lon: 20,
                lat: 55,
                value: 1
            }, {
                lon: -10,
                lat: 35,
                value: 1
            }, {
                lon: 25,
                lat: 40,
                value: 2
            }, {
                lon: 30,
                lat: 45,
                value: 1
            }, {
                lon: 25,
                lat: 50,
                value: 2
            }, {
                lon: -10,
                lat: 55,
                value: 1
            }, {
                lon: 35,
                lat: 35,
                value: 2
            }, {
                lon: 25,
                lat: 35,
                value: 1
            }, {
                lon: 15,
                lat: 60,
                value: 2
            }, {
                lon: 30,
                lat: 50,
                value: 1
            }, {
                lon: 25,
                lat: 60,
                value: 2
            }, {
                lon: -10,
                lat: 45,
                value: 1
            }]
        }]
    });
})();