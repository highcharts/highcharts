// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-wi-08', 0],
    ['us-wi-03', 1],
    ['us-wi-07', 2],
    ['us-wi-06', 3],
    ['us-wi-02', 4],
    ['us-wi-01', 5],
    ['us-wi-05', 6],
    ['us-wi-04', 7]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-wi-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-wi-congress-113.js">Wisconsin congressional districts</a>'
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
