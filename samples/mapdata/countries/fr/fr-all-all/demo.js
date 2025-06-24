(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fr/fr-all-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-28', 10], ['fr-24', 11], ['fr-40', 12], ['fr-86', 13],
        ['fr-51', 14], ['fr-04', 15], ['fr-15', 16], ['fr-55', 17],
        ['fr-77', 18], ['fr-88', 19], ['fr-06', 20], ['fr-01', 21],
        ['fr-82', 22], ['fr-93', 23], ['fr-83', 24], ['fr-89', 25],
        ['fr-13', 26], ['fr-62', 27], ['fr-08', 28], ['fr-52', 29],
        ['fr-71', 30], ['fr-22', 31], ['fr-41', 32], ['fr-59', 33],
        ['fr-91', 34], ['fr-85', 35], ['fr-68', 36], ['fr-50', 37],
        ['fr-33', 38], ['fr-63', 39], ['fr-74', 40], ['fr-37', 41],
        ['fr-49', 42], ['fr-90', 43], ['fr-02', 44], ['fr-31', 45],
        ['fr-67', 46], ['fr-36', 47], ['fr-87', 48], ['fr-61', 49],
        ['fr-42', 50], ['fr-48', 51], ['fr-32', 52], ['fr-70', 53],
        ['fr-21', 54], ['fr-73', 55], ['fr-76', 56], ['fr-60', 57],
        ['fr-16', 58], ['fr-34', 59], ['fr-07', 60], ['fr-17', 61],
        ['fr-44', 62], ['fr-95', 63], ['fr-26', 64], ['fr-27', 65],
        ['fr-05', 66], ['fr-38', 67], ['fr-53', 68], ['fr-09', 69],
        ['fr-45', 70], ['fr-10', 71], ['fr-81', 72], ['fr-72', 73],
        ['fr-84', 74], ['fr-11', 75], ['fr-56', 76], ['fr-58', 77],
        ['fr-92', 78], ['fr-64', 79], ['fr-12', 80], ['fr-43', 81],
        ['fr-14', 82], ['fr-46', 83], ['fr-79', 84], ['fr-18', 85],
        ['fr-78', 86], ['fr-94', 87], ['fr-23', 88], ['fr-39', 89],
        ['fr-30', 90], ['fr-25', 91], ['fr-80', 92], ['fr-19', 93],
        ['fr-35', 94], ['fr-66', 95], ['fr-65', 96], ['fr-57', 97],
        ['fr-54', 98], ['fr-75c', 99], ['fr-2b', 100], ['fr-2a', 101],
        ['fr-29', 102], ['fr-976', 103], ['fr-973', 104], ['fr-47', 105],
        ['fr-971', 106], ['fr-03', 107], ['fr-974', 108], ['fr-972', 109],
        ['fr-69m', 110], ['fr-69', 111]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/fr/fr-all-all.topo.json">France, admin2</a>'
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
