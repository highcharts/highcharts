// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-ak-216', 0],
    ['no-ak-217', 1],
    ['no-ak-213', 2],
    ['no-ak-214', 3],
    ['no-ak-211', 4],
    ['no-os-219', 5],
    ['no-ak-239', 6],
    ['no-ak-238', 7],
    ['no-ak-234', 8],
    ['no-ak-235', 9],
    ['no-ak-236', 10],
    ['no-ak-215', 11],
    ['no-ak-237', 12],
    ['no-ak-233', 13],
    ['no-ak-231', 14],
    ['no-ak-229', 15],
    ['no-ak-230', 16],
    ['no-ak-228', 17],
    ['no-ak-227', 18],
    ['no-ak-226', 19],
    ['no-ak-221', 20],
    ['no-os-220', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-ak-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-ak-all.js">Akershus</a>'
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
