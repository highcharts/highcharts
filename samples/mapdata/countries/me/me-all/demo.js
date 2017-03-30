// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['me-an', 0],
    ['me-be', 1],
    ['me-bp', 2],
    ['me-kl', 3],
    ['me-da', 4],
    ['me-mk', 5],
    ['me-nk', 6],
    ['me-pu', 7],
    ['me-pl', 8],
    ['me-pg', 9],
    ['me-ti', 10],
    ['me-sa', 11],
    ['me-za', 12],
    ['me-ba', 13],
    ['me-ce', 14],
    ['me-bu', 15],
    ['me-ul', 16],
    ['me-ro', 17],
    ['me-pv', 18],
    ['me-hn', 19],
    ['me-kt', 20]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/me/me-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/me/me-all.js">Montenegro</a>'
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
