// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['hn-ib', 0],
    ['hn-va', 1],
    ['hn-at', 2],
    ['hn-gd', 3],
    ['hn-cl', 4],
    ['hn-ol', 5],
    ['hn-fm', 6],
    ['hn-yo', 7],
    ['hn-cm', 8],
    ['hn-cr', 9],
    ['hn-in', 10],
    ['hn-lp', 11],
    ['hn-sb', 12],
    ['hn-cp', 13],
    ['hn-le', 14],
    ['hn-oc', 15],
    ['hn-ch', 16],
    ['hn-ep', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/hn/hn-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/hn/hn-all.js">Honduras</a>'
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
