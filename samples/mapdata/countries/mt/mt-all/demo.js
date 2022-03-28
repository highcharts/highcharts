(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/mt/mt-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['mt-7358', 10], ['mt-7363', 11], ['mt-7369', 12], ['mt-7346', 13],
        ['mt-7370', 14], ['mt-7374', 15], ['mt-7376', 16], ['mt-7373', 17],
        ['mt-7378', 18], ['mt-7380', 19], ['mt-7382', 20], ['mt-7384', 21],
        ['mt-7385', 22], ['mt-7386', 23], ['mt-7396', 24], ['mt-7393', 25],
        ['mt-7332', 26], ['mt-7353', 27], ['mt-3630', 28], ['mt-7344', 29],
        ['mt-7345', 30], ['mt-7347', 31], ['mt-7350', 32], ['mt-7352', 33],
        ['mt-7354', 34], ['mt-7355', 35], ['mt-7351', 36], ['mt-7356', 37],
        ['mt-7360', 38], ['mt-7361', 39], ['mt-7364', 40], ['mt-7365', 41],
        ['mt-7366', 42], ['mt-7367', 43], ['mt-7368', 44], ['mt-7372', 45],
        ['mt-7359', 46], ['mt-7375', 47], ['mt-7377', 48], ['mt-7379', 49],
        ['mt-7381', 50], ['mt-7383', 51], ['mt-7388', 52], ['mt-7389', 53],
        ['mt-7390', 54], ['mt-7387', 55], ['mt-7391', 56], ['mt-7394', 57],
        ['mt-7395', 58], ['mt-7397', 59], ['mt-7343', 60], ['mt-7336', 61],
        ['mt-7337', 62], ['mt-7331', 63], ['mt-7339', 64], ['mt-7340', 65],
        ['mt-7342', 66], ['mt-7341', 67], ['mt-7348', 68], ['mt-7349', 69],
        ['mt-7357', 70], ['mt-7371', 71], ['mt-7392', 72], ['mt-7330', 73],
        ['mt-7333', 74], ['mt-7335', 75], ['mt-7338', 76], ['mt-7334', 77]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mt/mt-all.topo.json">Malta</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
