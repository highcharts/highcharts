// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['tj-le', 0],
    ['tj-du', 1],
    ['tj-bk', 2],
    ['tj-kl', 3],
    ['tj-rr', 4]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/tj/tj-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tj/tj-all.js">Tajikistan</a>'
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

    series: [
        {
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
        }
    ]
});
