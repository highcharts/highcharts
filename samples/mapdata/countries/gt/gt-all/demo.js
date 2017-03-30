// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['gt-qc', 0],
    ['gt-pe', 1],
    ['gt-hu', 2],
    ['gt-qz', 3],
    ['gt-re', 4],
    ['gt-sm', 5],
    ['gt-bv', 6],
    ['gt-av', 7],
    ['gt-es', 8],
    ['gt-cm', 9],
    ['gt-gu', 10],
    ['gt-su', 11],
    ['gt-sa', 12],
    ['gt-so', 13],
    ['gt-to', 14],
    ['gt-pr', 15],
    ['gt-sr', 16],
    ['gt-iz', 17],
    ['gt-cq', 18],
    ['gt-ja', 19],
    ['gt-ju', 20],
    ['gt-za', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/gt/gt-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gt/gt-all.js">Guatemala</a>'
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
