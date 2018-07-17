// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-vf-701', 0],
    ['no-vf-723', 1],
    ['no-vf-706', 2],
    ['no-vf-722', 3],
    ['no-vf-711', 4],
    ['no-vf-709', 5],
    ['no-vf-714', 6],
    ['no-vf-720', 7],
    ['no-vf-716', 8],
    ['no-vf-704', 9],
    ['no-vf-713', 10],
    ['no-vf-728', 11],
    ['no-vf-702', 12],
    ['no-vf-719', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-vf-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-vf-all.js">Vestfold</a>'
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
