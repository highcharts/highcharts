// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-pa-18', 0],
    ['us-pa-01', 1],
    ['us-pa-13', 2],
    ['us-pa-08', 3],
    ['us-pa-07', 4],
    ['us-pa-02', 5],
    ['us-pa-03', 6],
    ['us-pa-05', 7],
    ['us-pa-10', 8],
    ['us-pa-04', 9],
    ['us-pa-17', 10],
    ['us-pa-06', 11],
    ['us-pa-14', 12],
    ['us-pa-16', 13],
    ['us-pa-11', 14],
    ['us-pa-09', 15],
    ['us-pa-15', 16],
    ['us-pa-12', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-pa-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-pa-congress-113.js">Pennsylvania congressional districts</a>'
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
