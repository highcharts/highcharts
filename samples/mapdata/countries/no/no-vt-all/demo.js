// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-vt-3804', 0],
    ['no-vt-3811', 1],
    ['no-vt-3801', 2],
    ['no-vt-3803', 3],
    ['no-vt-3808', 4],
    ['no-vt-3822', 5],
    ['no-vt-3806', 6],
    ['no-vt-3823', 7],
    ['no-vt-3812', 8],
    ['no-vt-3825', 9],
    ['no-vt-3821', 10],
    ['no-vt-3820', 11],
    ['no-vt-3818', 12],
    ['no-vt-3819', 13],
    ['no-vt-3816', 14],
    ['no-vt-3807', 15],
    ['no-vt-3805', 16],
    ['no-vt-3817', 17],
    ['no-vt-3813', 18],
    ['no-vt-3814', 19],
    ['no-vt-3802', 20],
    ['no-vt-3815', 21],
    ['no-vt-3824', 22]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-vt-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-vt-all.js">Vestfold og Telemark</a>'
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
