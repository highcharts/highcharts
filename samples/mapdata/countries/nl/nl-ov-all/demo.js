// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-ov-gm0166', 0],
    ['nl-ov-gm0168', 1],
    ['nl-ov-gm0148', 2],
    ['nl-ov-gm0160', 3],
    ['nl-ov-gm0158', 4],
    ['nl-ov-gm0164', 5],
    ['nl-ov-gm1896', 6],
    ['nl-ov-gm0193', 7],
    ['nl-ov-gm0153', 8],
    ['nl-ov-gm0173', 9],
    ['nl-ov-gm1774', 10],
    ['nl-ov-gm0163', 11],
    ['nl-ov-gm0175', 12],
    ['nl-ov-gm0177', 13],
    ['nl-ov-gm1708', 14],
    ['nl-ov-gm0180', 15],
    ['nl-ov-gm1742', 16],
    ['nl-ov-gm0147', 17],
    ['nl-ov-gm0141', 18],
    ['nl-ov-gm1773', 19],
    ['nl-ov-gm0189', 20],
    ['nl-ov-gm0183', 21],
    ['nl-ov-gm1735', 22],
    ['nl-ov-gm0150', 23],
    ['nl-ov-gm1700', 24]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-ov-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-ov-all.js">Overijssel</a>'
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
