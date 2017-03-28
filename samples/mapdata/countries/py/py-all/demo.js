// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['py-ag', 0],
    ['py-bq', 1],
    ['py-cn', 2],
    ['py-ph', 3],
    ['py-cr', 4],
    ['py-sp', 5],
    ['py-ce', 6],
    ['py-mi', 7],
    ['py-ne', 8],
    ['py-gu', 9],
    ['py-pg', 10],
    ['py-am', 11],
    ['py-aa', 12],
    ['py-cg', 13],
    ['py-cz', 14],
    ['py-cy', 15],
    ['py-it', 16],
    ['py-as', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/py/py-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/py/py-all.js">Paraguay</a>'
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
