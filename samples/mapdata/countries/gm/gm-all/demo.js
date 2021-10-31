// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['gm-mc', 0],
    ['gm-ur', 1],
    ['gm-bj', 2],
    ['gm-lr', 3],
    ['gm-wc', 4],
    ['gm-nb', 5]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/gm/gm-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gm/gm-all.js">Gambia</a>'
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
