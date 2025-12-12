(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/mt/mt-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['mt-03', 10], ['mt-56', 11], ['mt-31', 12], ['mt-30', 13],
        ['mt-13', 14], ['mt-10', 15], ['mt-22', 16], ['mt-50', 17],
        ['mt-14', 18], ['mt-16', 19], ['mt-45', 20], ['mt-65', 21],
        ['mt-61', 22], ['mt-42', 23], ['mt-37', 24], ['mt-62', 25],
        ['mt-36', 26], ['mt-52', 27], ['mt-18', 28], ['mt-54', 29],
        ['mt-29', 30], ['mt-02', 31], ['mt-01', 32], ['mt-66', 33],
        ['mt-47', 34], ['mt-23', 35], ['mt-33', 36], ['mt-43', 37],
        ['mt-11', 38], ['mt-53', 39], ['mt-59', 40], ['mt-08', 41],
        ['mt-67', 42], ['mt-17', 43], ['mt-25', 44], ['mt-35', 45],
        ['mt-46', 46], ['mt-07', 47], ['mt-55', 48], ['mt-44', 49],
        ['mt-68', 50], ['mt-05', 51], ['mt-28', 52], ['mt-27', 53],
        ['mt-64', 54], ['mt-63', 55], ['mt-21', 56], ['mt-06', 57],
        ['mt-39', 58], ['mt-20', 59], ['mt-26', 60], ['mt-60', 61],
        ['mt-09', 62], ['mt-41', 63], ['mt-58', 64], ['mt-34', 65],
        ['mt-04', 66], ['mt-19', 67], ['mt-49', 68], ['mt-12', 69],
        ['mt-48', 70], ['mt-40', 71], ['mt-57', 72], ['mt-15', 73],
        ['mt-24', 74], ['mt-32', 75], ['mt-38', 76], ['mt-51', 77]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/mt/mt-all.topo.json">Malta</a>'
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
