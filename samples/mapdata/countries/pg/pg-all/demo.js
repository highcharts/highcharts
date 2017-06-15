// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['pg-4773', 0],
    ['pg-es', 1],
    ['pg-md', 2],
    ['pg-ns', 3],
    ['pg-we', 4],
    ['pg-en', 5],
    ['pg-mn', 6],
    ['pg-mb', 7],
    ['pg-mr', 8],
    ['pg-ni', 9],
    ['pg-wn', 10],
    ['pg-eh', 11],
    ['pg-gu', 12],
    ['pg-eg', 13],
    ['pg-ch', 14],
    ['pg-1041', 15],
    ['pg-ce', 16],
    ['pg-no', 17],
    ['pg-sa', 18],
    ['pg-sh', 19],
    ['pg-wh', 20]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/pg/pg-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pg/pg-all.js">Papua New Guinea</a>'
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
