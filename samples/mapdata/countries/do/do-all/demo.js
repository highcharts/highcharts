// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['do-pn', 0],
    ['do-al', 1],
    ['do-pv', 2],
    ['do-jo', 3],
    ['do-hm', 4],
    ['do-mp', 5],
    ['do-du', 6],
    ['do-mt', 7],
    ['do-sm', 8],
    ['do-cr', 9],
    ['do-nc', 10],
    ['do-se', 11],
    ['do-ro', 12],
    ['do-st', 13],
    ['do-sr', 14],
    ['do-va', 15],
    ['do-ju', 16],
    ['do-sd', 17],
    ['do-pm', 18],
    ['do-mc', 19],
    ['do-pp', 20],
    ['do-da', 21],
    ['do-es', 22],
    ['do-1857', 23],
    ['do-br', 24],
    ['do-bh', 25],
    ['do-in', 26],
    ['do-ep', 27],
    ['do-az', 28],
    ['do-ve', 29],
    ['do-sz', 30],
    ['do-mn', 31]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/do/do-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/do/do-all.js">Dominican Republic</a>'
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
